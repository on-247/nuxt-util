<script setup lang="ts">
const { clone, set, Week } = useTime();
var week = reactive(new Week());
const func = {
  set_year(year: number) {
    var nw = new Week(set(clone(week.min.date), { y: year }));
    week.replace(nw);
  },
  set(next=1) {
    var nw = next ? week.next() : week.prev();
    week.replace(nw);
  }
}
</script>

<template>
  <div class="w-full">
    <h1>Welcome to this demo</h1>
    <div class="w-full h-full flex flex-col">
      <div class="w-full px-2 flex items-center justify-center gap-4">
        <Icon name="chevron-left" @click="func.set(0)" />
        <div><input class="max-w-[48px]" :value="week.min?.year" @blur="evt => func.set_year(Number(evt.target.value))" /></div>
        <div>{{ ({
          0: 'jan',
          1: 'feb',
          2: 'mar',
          3: 'apr',
          4: 'may',
          5: 'jun',
          6: 'jul',
          7: 'aug',
          8: 'sep',
          9: 'okt',
          10: 'nov',
          11: 'dec'
        })[week.day(4).month]}}</div>
        <div>w{{ week.number }}</div>
        <Icon name="chevron-right" @click="func.set()" />
      </div>
      <div class="w-full h-full grid grid-cols-7 border">
        <div
          v-for="day, i in week"
          class="border p-2"
          @click=""
        >
          {{ day.name }} {{ day.date_ }}
          <div v-if="i == 0" class="opacity-40">{{ day.week }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
