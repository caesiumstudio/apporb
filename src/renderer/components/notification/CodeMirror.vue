<template>
  <codemirror
    v-model="code"
    placeholder=""
    :style="{ height: '140px' }"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="extensions"
    @ready="handleReady"
    @change="onChange($event)"
    @focus="onFocus($event)"
    @blur="onBlur($event)"
  />
</template>

<script>
import { ref, shallowRef } from "vue";
import { Codemirror } from "vue-codemirror";
import { json } from "@codemirror/lang-json";
// import { oneDark } from "@codemirror/theme-one-dark";

export default {
  components: {
    Codemirror,
  },

  data() {
    return {
      code: "",
      extensions: [],
      handleReady: "",
      log: console.log,
    };
  },

  props: {
    jsonText: String,
  },

  watch: {
    jsonText: {
      handler(newJsonText) {
        this.refresh(newJsonText);
      },
    },
  },

  methods: {

    onChange(event) {
      this.$emit("onChange", event);
    },

    onFocus(event) {
      console.log(event);
    },

    onBlur(event) {
      console.log(event);
    },

    refresh(code) {
      try {
        console.log(JSON.stringify(JSON.parse(code), null, 4));
        this.code = ref(JSON.stringify(JSON.parse(code), null, 4));
        // this.extensions = [json(), oneDark];
        this.extensions = [json()];

        // Codemirror EditorView instance ref
        const view = shallowRef();
        this.handleReady = (payload) => {
          view.value = payload.view;
        };
      } catch (e) {
        console.log(e);
      }

      // // Status is available at all times via Codemirror EditorView
      // const getCodemirrorStates = () => {
      //   const state = view.value.state;
      //   const ranges = state.selection.ranges;
      //   const selected = ranges.reduce(
      //     (r, range) => r + range.to - range.from,
      //     0
      //   );
      //   const cursor = ranges[0].anchor;
      //   const length = state.doc.length;
      //   const lines = state.doc.lines;
      // };
    },
  },
  mounted() {
    this.refresh("{}");
  },
};
</script>