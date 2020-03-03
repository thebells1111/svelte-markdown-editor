<script>
  import { onMount } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js';

  self.MonacoEnvironment = {
    getWorkerUrl: function(moduleId, label) {
      if (label === 'json') {
        return './json.worker.js';
      }
      if (label === 'css') {
        return './css.worker.js';
      }
      if (label === 'html') {
        return './html.worker.js';
      }
      if (label === 'typescript' || label === 'javascript') {
        return './ts.worker.js';
      }
      return './editor.worker.js';
    },
  };

  const dispatch = createEventDispatcher();

  export let language;
  export let textModelOptions;
  export let editorOptions;
  export let model;
  let editor;

  model = monaco.editor.createModel('', language);
  model.updateOptions(textModelOptions);
  editorOptions = { ...{ model: model }, ...editorOptions };

  model.onDidChangeContent(e => {
    dispatch('didContentChange', {
      value: model.getValue(),
    });
  });

  onMount(() => {
    monaco.editor.create(editor, editorOptions);
  });
</script>

<style>
  div {
    width: 100%;
    height: 100%;
  }
</style>

<div bind:this={editor} />
