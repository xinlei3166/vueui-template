<template>
  <table class="xl-table">
    <thead>
    <tr>
      <th v-for="(col, index) in columns" :key="index">{{ col.title }}</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(row, rowIndex) in data" :key="rowIndex">
      <td v-for="(col, index) in columns" :key="index">
        <template v-if="'render' in col">
          <Render :row="row" :column="col" :index="rowIndex" :render="col.render"></Render>
        </template>
        <template v-else-if="'slot' in col">
          <SlotScope :row="row" :column="col" :index="rowIndex"></SlotScope>
        </template>
        <template v-else>{{ row[col.key] }}</template>
      </td>
    </tr>
    </tbody>
  </table>
</template>
<script>
  import Render from './render'
  import SlotScope from './slot.js'

  export default {
    name: 'xlTable',
    components: { Render, SlotScope },
    provide () {
      return {
        tableRoot: this
      }
    },
    props: {
      columns: { type: Array, default: () => [] },
      data: { type: Array, default: () => [] },
      index: { type: Number },
      render: { type: Function }
    }
  }
</script>
<style scoped></style>
