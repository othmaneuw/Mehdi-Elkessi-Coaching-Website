emailjs.init({
  publicKey: "d1IXkXVgrThwqjYS7",
});

const SERVICE_ID = "service_vn75a2c";
const TEMPLATE_ID = "template_kz3acxf";

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

  // Scroll back to the beginning of the questionnaire
  document.querySelector("#questionnaire").scrollIntoView({
    behavior: "smooth",
  });
}

/* =========================================================
   CHECK CURRENT STEP
========================================================= */

function validateCurrentStep() {
  const currentFormStep = steps[currentStep];

  const fields = currentFormStep.querySelectorAll("input, textarea");

  for (const field of fields) {
    if (!field.checkValidity()) {
      field.reportValidity();

      return false;
    }
  }

  return true;
}

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

  if (!validateCurrentStep()) {
    return;
  }

  const submitButton = document.querySelector('.submit-btn')
  submitButton.textContent = "Envoi en cours..."

  //alert("Merci pour ta candidature ! Je reviendrai vers toi rapidement.");
  emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form).then(() => {
    //alert("Merci pour ta candidature ! Je reviendrai vers toi rapidement.");
    form.reset();
    showStep(0)
    submitButton.innerHTML = `
    ENVOYER MA CANDIDATURE
                <span>→</span>
    `
  }).catch((error)=>{
    console.error("error : ",error)
    alert("Une erreur est survenue")
  });
});
