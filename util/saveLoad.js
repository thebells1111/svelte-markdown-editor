function copyToClipboard(text) {
  var dummy = document.createElement('textarea');
  // to avoid breaking orgain page when copying more words
  // cant copy when adding below this code
  // dummy.style.display = 'none'
  document.body.appendChild(dummy);
  //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
  dummy.value = text;
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);
}

function saveLoad(e, html, markdownModel, styleModel, fileName) {
  if (window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) {
    if (e.keyCode === 83) {
      //Ctrl-s
      e.preventDefault();

      const data = JSON.stringify({
        title: fileName,
        slug: fileName.replace(/\s+/g, '-').toLowerCase(),
        markdown: markdownModel.getValue(),
        css: styleModel.getValue(),
      });

      /*

      async function saveFile() {
        const location = window.location.hostname;
        const settings = {
          method: "POST",
          body: data,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          }
        };
        try {
          const fetchResponse = await fetch(
            `http://${location}:3030/`,
            settings
          );
          const data = fetchResponse;
          return data;
        } catch (e) {
          return e;
        }
      }

      saveFile().then(e => {
        console.log(e);
      });
      */

      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', fileName + '.json');
      const event = document.createEvent('MouseEvents');
      event.initMouseEvent('click');
      link.dispatchEvent(event);
    } else if (e.keyCode === 72) {
      //Ctrl-h
      e.preventDefault();
      copyToClipboard(html);
    } else if (e.keyCode === 76) {
      //Ctrl-l
      e.preventDefault();
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.addEventListener('change', readFile);
      const event = document.createEvent('MouseEvents');
      event.initMouseEvent('click');
      input.dispatchEvent(event);

      function readFile(evt) {
        evt.preventDefault();
        const f = evt.target.files[0];
        if (f) {
          var r = new FileReader();
          r.onload = function(e) {
            const contents = JSON.parse(e.target.result);
            markdownModel.setValue(contents.markdown);
            styleModel.setValue(contents.css);
          };
          r.readAsText(f);
        } else {
          alert('Failed to load file');
        }
      }
    }
  }
  return fileName;
}

export { saveLoad };
