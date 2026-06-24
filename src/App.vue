<template>
  <router-view v-slot="{ Component }">
    <transition name="slide-page" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>