<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\View\View;
use Illuminate\Support\Str;
use App\Models\UserProvider;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Http\JsonResponse;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Auth\Events\Registered;
use App\Http\Resources\AccountsResource;
use Illuminate\Support\Facades\Password;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register new user
     */
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $user->ulid = Str::ulid()->toBase32();
        $user->save();

        event(new Registered($user));

        return response()->json([
            'ok' => true,
        ], 201);
    }

    /**
     * Redirect to provider for authentication
     */
    public function redirect(Request $request, string $provider): RedirectResponse
    {
        return Socialite::driver($provider)->stateless()->redirect();
    }

    /**
     * Handle callback from provider
     * @throws \Exception
     */
    public function callback(Request $request, string $provider): View
    {
        $oAuthUser = Socialite::driver($provider)->stateless()->user();

        if (!$oAuthUser?->token) {
            return view('oauth', [
                'message' => [
                    'ok' => false,
                    'message' => __('Unable to authenticate with :provider', ['provider' => $provider]),
                ],
            ]);
        }

        $userProvider = UserProvider::select('id', 'user_id')
            ->where('name', $provider)
            ->where('provider_id', $oAuthUser->id)
            ->first();

        if (!$userProvider) {
            if (User::where('email', $oAuthUser->email)->exists()) {
                return view('oauth', [
                    'message' => [
                        'ok' => false,
                        'message' => __('Unable to authenticate with :provider. User with email :email already exists. To connect a new service to your account, you can go to your account settings and go through the process of linking your account.', [
                            'provider' => $provider,
                            'email' => $oAuthUser->email,
                        ]),
                    ],
                ]);
            }

            $user = new User();
            $user->ulid = Str::ulid()->toBase32();
            $user->avatar = $oAuthUser->picture ?? $oAuthUser->avatar_original ?? $oAuthUser->avatar;
            $user->name = $oAuthUser->name;
            $user->email = $oAuthUser->email;
            $user->password = null;
            $user->email_verified_at = now();
            $user->save();

            $user->userProviders()->create([
                'provider_id' => $oAuthUser->id,
                'name' => $provider,
            ]);
        } else {
            $user = $userProvider->user;
        }

        $token = $user->createDeviceToken(
            device: $request->deviceName(),
            ip: $request->ip(),
            remember: true
        );

        return view('oauth', [
            'message' => [
                'ok' => true,
                'provider' => $provider,
                'token' => $token,
            ],
        ]);
    }

    /**
     * Generate sanctum token on successful login
     * @throws ValidationException
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::select(['id', 'password'])->where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        $token = $user->createDeviceToken(
            device: $request->deviceName(),
            ip: $request->ip(),
            remember: $request->input('remember', false)
        );

        return response()->json([
            'ok' => true,
            'token' => $token,
        ]);
    }

    /**
     * Revoke token; only remove token that is used to perform logout (i.e. will not revoke all tokens)
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'ok' => true,
        ]);
    }

    /**
     * Get authenticated user details
     */
    public function user(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'ok' => true,
            'user' => [
                ...$user->toArray(),
                'must_verify_email'     => $user->mustVerifyEmail(),
                'has_password'          => (bool) $user->password,
                'timezone'              => $user->timezone,
                'providers'             => $user->userProviders()->select('name')->pluck('name'),
                'accounts'              => $user->accounts->all(),
                'unixes'                => $user->dateUnix()->select(['date_unix'])->get()->toArray(),
                'sessions'              => $user->sessions
            ],
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     * @throws ValidationException
     */
    public function sendResetPasswordLink(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        // We will send the password reset link to this user. Once we have attempted
        // to send the link, we will examine the response then see the message we
        // need to show to the user. Finally, we'll send out a proper response.
        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status !== Password::RESET_LINK_SENT) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return response()->json([
            'ok' => true,
            'message' => __($status),
        ]);
    }

    /**
     * Handle an incoming new password request.
     * @throws ValidationException
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email', 'exists:'.User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Here we will attempt to reset the user's password. If it is successful we
        // will update the password on an actual user model and persist it to the
        // database. Otherwise we will parse the error and return the response.
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            static function ($user) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($request->password),
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return response()->json([
            'ok' => true,
            'message' => __($status),
        ]);
    }

    /**
     * Mark the authenticated user's email address as verified.
     */
    public function verifyEmail(Request $request, string $ulid, string $hash): JsonResponse
    {
        $user = User::where('ulid', $ulid)->first();

        abort_if(!$user, 404);
        abort_if(!hash_equals(sha1($user->getEmailForVerification()), $hash), 403, __('Invalid verification link'));

        if (!$user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();

            event(new Verified($user));
        }

        return response()->json([
            'ok' => true,
        ]);
    }

    /**
     * Send a new email verification notification.
     */
    public function verificationNotification(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = $request->user()?: User::where('email', $request->email)->whereNull('email_verified_at')->first();

        abort_if(!$user, 400);

        $user->sendEmailVerificationNotification();

        return response()->json([
            'ok' => true,
            'message' => __('Verification link sent!'),
        ]);
    }

    /**
     * Get authenticated user devices
     */
    public function devices(Request $request): JsonResponse
    {
        $user = $request->user();

        $devices = $user->tokens()
            ->select('id', 'name', 'ip', 'last_used_at')
            ->orderBy('last_used_at', 'DESC')
            ->get();

        $currentToken = $user->currentAccessToken();

        foreach ($devices as $device) {
            $device->hash = Crypt::encryptString($device->id);

            if ($currentToken->id === $device->id) {
                $device->is_current = true;
            }

            unset($device->id);
        }

        return response()->json([
            'ok' => true,
            'devices' => $devices,
        ]);
    }

    /**
     * Revoke token by id
     */
    public function deviceDisconnect(Request $request): JsonResponse
    {
        $request->validate([
            'hash' => 'required',
        ]);

        $user = $request->user();

        $id = (int) Crypt::decryptString($request->hash);

        if (!empty($id)) {
            $user->tokens()->where('id', $id)->delete();
        }

        return response()->json([
            'ok' => true,
        ]);
    }
}
