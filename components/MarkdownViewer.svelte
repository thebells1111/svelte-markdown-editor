<script>
  import { onMount } from "svelte";
  import * as markdownItAttrs from "markdown-it-attrs";
  const Prism = require("prismjs");

  let md = require("markdown-it")({
    html: true,
    highlight: (str, lang) => {
      if (lang) {
        let langObject = Prism.languages[lang];
        try {
          return (
            `<pre class=" language-${lang}"><code class=" language-${lang}>` +
            Prism.highlight(str, langObject, lang) +
            "</code></pre>"
          );
        } catch (__) {}
      }
      return (
        `<pre class=" language-${lang}><code class=" language-${lang}>` +
        md.utils.escapeHtml(str) +
        "</code></pre>"
      );
    }
  });
  md.use(markdownItAttrs);

  export let markdown;
  export let html;
  let observed;
  let oldNode = [];
  $: rendered = md.render(markdown);
  $: if (html !== rendered) {
    html = rendered;
  }

  onMount(() => {
    var mutationObserver = new MutationObserver(function(mutations) {
      let nodes = [...mutations[0].addedNodes].filter(
        v => v.nodeType !== 8 && v.nodeType !== 3
      );

      nodes.forEach(function(node, i) {
        if (oldNode[i]) {
          if (
            !(
              node.innerHTML === oldNode[i].innerHTML ||
              node.innerText === oldNode[i].innerText
            )
          ) {
            node.scrollIntoView();
          }
          //console.log(node.innerHTML);
          //console.log(oldNode[i].innerHTML);
        } else {
          node.scrollIntoView();
        }
      });

      oldNode = nodes;
    });

    mutationObserver.observe(observed, {
      tributes: true,
      characterData: true,
      childList: true,
      attributeOldValue: true,
      characterDataOldValue: true
    });
  });
</script>

<style>
  div {
    overflow-y: auto;
    width: 100%;
    height: 100%;
  }
</style>

<div bind:this="{observed}">
  {@html rendered}
</div>
