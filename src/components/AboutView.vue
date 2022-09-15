<template>
  <div class="wra-main">
    <el-table :data="list" class="table" :row-class-name="tableRowClassName">
      <el-table-column prop="name" label="昵称" width="655" />
      <el-table-column prop="grade" label="分数" width="655" />
    </el-table>
  </div>
</template>

<script lang="ts" setup>
interface User {
  achievement: string;
  name: string;
}

const { list } = defineProps(["list"]);

const tableRowClassName = ({
  row,
  rowIndex,
}: {
  row: User;
  rowIndex: number;
}) => {
  if (row.self) {
    if (rowIndex === 0) {
      return "one-row own-row";
    } else if (rowIndex === 1) {
      return "two-row own-row";
    } else if (rowIndex === 2) {
      return "three-row own-row";
    }
  }

  if (rowIndex === 0) {
    return "one-row";
  } else if (rowIndex === 1) {
    return "two-row";
  } else if (rowIndex === 2) {
    return "three-row";
  }

  return "";
};

// const tableData: User = [
//   {
//     name: 'Tom',
//     achievement: '34'
//   },
//   {
//     name: 'Tom',
//     achievement: '34'
//   },
//   {
//     name: 'Tom',
//     achievement: '34'
//   },
//   {
//     name: 'Tom',
//     achievement: '9'
//   },
//   {
//     name: 'Jerry',
//     achievement: '9'
//   },
//   {
//     name: 'Tom',
//     achievement: '9'
//   }
// ]
</script>
<style>
.wra-main {
  height: 100%;
  width: 100%;
  background-color: #ebecf0;
  color: #444;

  backdrop-filter: blur(3px);

  border-radius: 25px;
  padding: 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-content: flex-start;
  flex-wrap: wrap;
  position: relative;
  /* left: 15%; */
}
.table .one-row {
  --el-table-tr-bg-color: #f9bdbd;
  font-weight: 600;
}
.table .two-row {
  --el-table-tr-bg-color: #eeee00;
  font-weight: 600;
}
.table .three-row {
  --el-table-tr-bg-color: #87ceeb;
  font-weight: 600;
}
.table .own-row {
  --el-table-tr-bg-color: #76eec6 !important;
  font-weight: 600 !important;
  color: rgb(62, 4, 4) !important;
  position: relative;
}
.table .own-row::after {
  content: "我的排名";
  position: absolute;
  top: 0;
  /* left: 0; */
  right: 40px;
  bottom: 0;
  margin: auto;
  color: rgb(62, 4, 4) !important;
  line-height: 40px;
}
.table {
  height: calc(100% - 150px);
  width: calc(100% - 160px);
  overflow: auto;

  border-radius: 25px;
  padding: 15px;
  width: 100%;
  height: 100%;
  color: #61677c;
  font-weight: bold;
  box-shadow: -3px -3px 10px #fff, 3px 3px 10px #babecc;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  font-weight: 60;
}
</style>
