document.addEventListener('DOMContentLoaded', () => {
  const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, 4, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ direction: 'rtl' }],
        [{ size: ['small', false, 'large', 'huge', 'date'] }],
        [{ color: [] }, { background: [] }],
        [{ font: [] }],
        [{ align: [] }],
        ['link', 'image'],
        ['clean'],
      ]
    }
  });

  // Dodanie wartości do textarea
  const textarea = document.getElementById('content');
  quill.on('text-change', () => {
    textarea.value = quill.root.innerHTML;
  });
  textarea.value = quill.root.innerHTML;
});
