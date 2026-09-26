/* =========================================================
   EMAILJS
========================================================= */

emailjs.init({
  publicKey: "vhWjjNW3KC1Fq6hR_",
});

const SERVICE_ID = "service_bengqai";
const TEMPLATE_ID = "template_3u8w2z2";

/* =========================================================
   ELEMENTS
========================================================= */

const form = document.querySelector("#coaching-form");

const steps = document.querySelectorAll(".form-step");

const nextButtons = document.querySelectorAll(".next-btn");

const previousButtons = document.querySelectorAll(".previous-btn");

let currentStep = 0;

/* =========================================================
   SHOW STEP
========================================================= */

function showStep(stepIndex) {
  steps.forEach((step, index) => {
    step.classList.toggle("active", index === stepIndex);
  });

  currentStep = stepIndex;

  document.querySelector("#questionnaire").scrollIntoView({
    behavior: "smooth",
  });
}

/* =========================================================
   GET ERROR MESSAGE
========================================================= */

function getErrorMessage(field) {
  if (field.validity.valueMissing) {
    if (field.type === "radio") {
      return "Merci de sélectionner une réponse.";
    }

    return "Ce champ est obligatoire.";
  }

  if (field.validity.typeMismatch) {
    return "Veuillez saisir une adresse e-mail valide.";
  }

  if (field.validity.rangeUnderflow) {
    return "La valeur doit être supérieure ou égale à 0.";
  }

  return "Veuillez vérifier ce champ.";
}

/* =========================================================
   SHOW FIELD ERROR
========================================================= */

function showFieldError(field) {
  const formGroup = field.closest(".form-group");

  if (!formGroup) {
    return;
  }

  formGroup.classList.add("error");

  const errorMessage = formGroup.querySelector(".field-error");

  if (!errorMessage) {
    return;
  }

  errorMessage.textContent = getErrorMessage(field);
}

/* =========================================================
   HIDE FIELD ERROR
========================================================= */

function hideFieldError(field) {
  const formGroup = field.closest(".form-group");

  if (!formGroup) {
    return;
  }

  formGroup.classList.remove("error");
}

/* =========================================================
   CHECK CURRENT STEP
========================================================= */

function validateCurrentStep() {
  const currentFormStep = steps[currentStep];

  const fields = currentFormStep.querySelectorAll("input, textarea");

  let isValid = true;

  fields.forEach((field) => {
    /*
      Radio buttons are grouped by name.

      We only validate the first radio
      of each group to avoid displaying
      the same error twice.
    */

    if (field.type === "radio") {
      const radioGroup = currentFormStep.querySelectorAll(
        `input[name="${field.name}"]`,
      );

      const isFirstRadio = field === radioGroup[0];

      if (!isFirstRadio) {
        return;
      }

      const isChecked = [...radioGroup].some((radio) => radio.checked);

      if (!isChecked) {
        showFieldError(field);

        isValid = false;
      } else {
        hideFieldError(field);
      }

      return;
    }

    /*
      Normal inputs / textareas
    */

    if (!field.checkValidity()) {
      showFieldError(field);

      isValid = false;
    } else {
      hideFieldError(field);
    }
  });

  return isValid;
}

/* =========================================================
   CLEAR ERROR WHEN USER FIXES FIELD
========================================================= */

const allFields = form.querySelectorAll("input, textarea");

allFields.forEach((field) => {
  /*
    Text inputs / textarea
  */

  field.addEventListener("input", () => {
    if (field.checkValidity()) {
      hideFieldError(field);
    }
  });

  /*
    Radio buttons
  */

  field.addEventListener("change", () => {
    if (field.type === "radio") {
      const radioGroup = form.querySelectorAll(`input[name="${field.name}"]`);

      const isChecked = [...radioGroup].some((radio) => radio.checked);

      if (isChecked) {
        hideFieldError(field);
      }
    } else {
      if (field.checkValidity()) {
        hideFieldError(field);
      }
    }
  });
});

/* =========================================================
   NEXT BUTTON
========================================================= */

nextButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < steps.length - 1) {
      showStep(currentStep + 1);
    }
  });
});

/* =========================================================
   PREVIOUS BUTTON
========================================================= */

previousButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (currentStep > 0) {
      showStep(currentStep - 1);
    }
  });
});

/* =========================================================
   SUBMIT
========================================================= */

form.addEventListener("submit", (event) => {
  event.preventDefault();

  /*
    Validate the final step
  */

  if (!validateCurrentStep()) {
    return;
  }

  const submitButton = document.querySelector(".submit-btn");

  /*
    Prevent multiple submissions
  */

  submitButton.disabled = true;

  submitButton.innerHTML = `
    ENVOI EN COURS...
  `;

  /* =======================================================
     SEND EMAIL
  ======================================================= */

  emailjs
    .sendForm(SERVICE_ID, TEMPLATE_ID, form)

    .then(() => {
      /*
        Reset the form
      */

      form.reset();

      /*
        Remove all error states
      */

      form.querySelectorAll(".form-group.error").forEach((group) => {
        group.classList.remove("error");
      });

      /*
        Return to step 1
      */

      showStep(0);

      /*
        Restore submit button
      */

      submitButton.disabled = false;

      submitButton.innerHTML = `
        ENVOYER MA CANDIDATURE
        <span>→</span>
      `;

      document.querySelector('.submitted').style.display = "block"

      /*
        Success message
      */

      //alert("Merci pour ta candidature ! Je reviendrai vers toi rapidement.");
    })

    .catch((error) => {
      console.error("Erreur EmailJS :", error);

      /*
        Restore button
      */

      submitButton.disabled = false;

      submitButton.innerHTML = `
        ENVOYER MA CANDIDATURE
        <span>→</span>
      `;

      alert("Une erreur est survenue lors de l'envoi. Merci de réessayer.");
    });
});
