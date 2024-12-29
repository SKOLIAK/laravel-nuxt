<template>
<div class="flex flex-col md:flex-row gap-4 items-center justify-between mb-5">
      <div class="flex items-center gap-4">
        <h5 class="text-xl leading-8 font-semibold text-gray-900">January 2024</h5>
        <div class="flex items-center">
          <button class="text-gray-600 p-1 rounded transition-all duration-300 hover:text-white hover:bg-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10.0002 11.9999L6 7.99971L10.0025 3.99719" stroke="currentcolor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
          <button class="text-gray-600 p-1 rounded transition-all duration-300 hover:text-white hover:bg-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6.00236 3.99707L10.0025 7.99723L6 11.9998" stroke="currentcolor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="border border-gray-200 rounded-xl">
      <div class="grid grid-cols-7 rounded-t-3xl border-b border-gray-200">
        <div class="py-3.5 border-r rounded-tl-xl border-gray-200 bg-gray-50 flex items-center justify-center text-sm font-medium text-gray-600">Sun</div>
        <div class="py-3.5 border-r border-gray-200 bg-gray-50 flex items-center justify-center text-sm font-medium text-gray-600">Mon</div>
        <div class="py-3.5 border-r border-gray-200 bg-gray-50 flex items-center justify-center text-sm font-medium text-gray-600">Tue</div>
        <div class="py-3.5 border-r border-gray-200 bg-gray-50 flex items-center justify-center text-sm font-medium text-gray-600">Wed</div>
        <div class="py-3.5 border-r border-gray-200 bg-gray-50 flex items-center justify-center text-sm font-medium text-gray-600">Thu</div>
        <div class="py-3.5 border-r border-gray-200 bg-gray-50 flex items-center justify-center text-sm font-medium text-gray-600">Fri</div>
        <div class="py-3.5 rounded-tr-xl bg-gray-50 flex items-center justify-center text-sm font-medium text-gray-600">Sat</div>
      </div>
      <div class="grid grid-cols-7 rounded-b-xl">
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-gray-50 border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50">
          <span class="text-xs font-semibold text-gray-400">27</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-gray-50 border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-400">28</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-gray-50 border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-400">29</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-gray-50 border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-400">30</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-gray-50 border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-400">31</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">1</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">2</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 relative green-trade bg-green-trade border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs block font-semibold text-center">
            <div>3</div>
            <div>+642$</div>
          </span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">4</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">5</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">6</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white green-trade bg-green-trade relative border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs block font-semibold text-center">
            <div>7</div>
            <div>+376$</div>
          </span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">8</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-600 sm:text-white sm:w-6 sm:h-6 rounded-full sm:flex items-center justify-center sm:bg-gray-600">9</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">10</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">11</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">12</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">13</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">14</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">15</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">16</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">17</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">18</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 relative bg-white border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">19</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">20</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">21</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">22</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">23</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">24</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">25</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">26</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">27</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-r border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">28</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 red-trade bg-red-trade border-r border-b border-gray-200 transition-all duration-300 hover:bg-purple-100 cursor-pointer">
          <span class="text-xs block font-semibold text-center">
            <div>29</div>
            <div>-209$</div>
          </span>

        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-b border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">30</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-white border-r border-gray-200 rounded-bl-xl transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-900">31</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-gray-50 border-r border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-400">1</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-gray-50 border-r border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-400">2</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-gray-50 border-r border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-400">3</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 relative bg-gray-50 border-r border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-400">4</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-gray-50 border-r border-gray-200 transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-400">5</span>
        </div>
        <div class="flex xl:aspect-square max-xl:min-h-[60px] p-3.5 bg-gray-50 border-gray-200 rounded-br-xl transition-all duration-300 hover:bg-gray-50 cursor-pointer">
          <span class="text-xs font-semibold text-gray-400">6</span>
        </div>
      </div>
    </div>
</template>
