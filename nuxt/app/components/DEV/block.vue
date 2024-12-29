<template>
      <div class="bg-black p-8 text-white rounded-lg mb-4 text-sm">
        <div class="tracking-tighter font-medium"><slot name="title"/></div>
        <code class="bg-white/10 p-0.5 text-xs !font-bold text-primary rounded"><slot name="code"/></code>
      </div>
</template>
