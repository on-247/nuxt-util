<script setup lang="ts">
const { clone, set, Month } = useTime();
var month = reactive(new Month());
const func = {
  set_year(year: number) {
    var nw = new Month(set(clone(month.min.date), { y: year }));
    month.replace(nw);
  },
  set(next=1) {
    var nw = next ? month.next() : month.prev();
    month.replace(nw);
  }
}
</script>

<template>
  <div class="w-full">
    <h1>Welcome to this demo</h1>
    <div class="w-full h-full flex flex-col">
      <div class="w-full px-2 flex items-center justify-center gap-4">
        <Icon name="chevron-left" @click="func.set(0)" />
        <div><input class="max-w-[48px]" :value="month.min?.year" @blur="evt => func.set_year(Number(evt.target.value))" /></div>
        <div>{{ month.name }}</div>
        <Icon name="chevron-right" @click="func.set()" />
      </div>
      <div
        v-for="week, wi in month"
        class="w-full h-full grid grid-cols-7 border"
      >
        <div
          v-for="day, i in week"
          class="border p-2"
          @click=""
        >
          {{ wi == 0 ? day.name + ' ' : '' }}{{ day.date_ }}
          <div v-if="i == 0" class="opacity-40">{{ day.week }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
