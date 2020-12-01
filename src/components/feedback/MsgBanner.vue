<template>
  <v-container>
    <v-row class="pa-4 secondary">
        <ul id="messages-1">
            <li v-for="(item, index) in items" :key="index">
                {{ item.message }}
            </li>
        </ul>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "MsgBanner",
  props: ["items"]
};
</script>

<style></style>
