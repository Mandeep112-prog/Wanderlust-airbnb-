(() => {
  'use strict'

  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {

      // 🔥 Trim all inputs & textareas
      const inputs = form.querySelectorAll("input, textarea");
      inputs.forEach(input => {
        input.value = input.value.trim();
      });

      // 🔥 Now check validity
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add('was-validated');

    }, false)
  })
})()