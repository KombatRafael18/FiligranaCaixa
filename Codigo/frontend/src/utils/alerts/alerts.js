import "sweetalert2/dist/sweetalert2.css";

import Swal from "sweetalert2";
import styles from "./alerts.module.css";

export async function fireSuccess(textHtml, title = "Sucesso") {
  const swalRes = await Swal.fire({
    title,
    html: textHtml,
    iconHtml: `<svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M88.4998 30H90.7498C94.0018 30 96.5887 27.0029 95.8826 23.6367C95.3699 21.1816 93.0848 19.5 90.577 19.5H79.4998C77.8416 19.5 76.4998 18.1582 76.4998 16.5C76.4998 14.8418 77.8416 13.5 79.4998 13.5H84.577C87.0818 13.5 89.3699 11.8184 89.8826 9.36328C90.5887 5.99707 88.0018 3 84.7498 3H12.7498C9.86115 3 7.49982 5.36133 7.49982 8.25C7.49982 11.1387 9.86115 13.5 12.7498 13.5H14.9998C16.658 13.5 17.9998 14.8418 17.9998 16.5C17.9998 18.1582 16.658 19.5 14.9998 19.5H6.92267C4.41779 19.5 2.1297 21.1816 1.61701 23.6367C0.910951 27.0029 3.49786 30 6.74982 30H26.9998V48H6.92267C4.41779 48 2.1297 49.6816 1.61701 52.1367C0.910951 55.5029 3.49786 58.5 6.74982 58.5H7.49982C9.15802 58.5 10.4998 59.8418 10.4998 61.5C10.4998 63.1582 9.15802 64.5 7.49982 64.5H6.74982C3.49786 64.5 0.910951 67.4971 1.61701 70.8633C2.1297 73.3184 4.41779 75 6.92267 75H14.9998C16.658 75 17.9998 76.3418 17.9998 78C17.9998 79.6582 16.658 81 14.9998 81H12.9227C10.4178 81 8.1297 82.6816 7.61701 85.1367C6.91095 88.5029 9.49786 91.5 12.7498 91.5H83.2498C86.1385 91.5 88.4998 89.1387 88.4998 86.25C88.4998 83.3613 86.1385 81 83.2498 81H82.4998C80.8416 81 79.4998 79.6582 79.4998 78C79.4998 76.3418 80.8416 75 82.4998 75H89.077C91.5818 75 93.8699 73.3184 94.3826 70.8633C95.0887 67.4971 92.5018 64.5 89.2498 64.5H70.4998V46.5H89.077C91.5818 46.5 93.8699 44.8184 94.3826 42.3633C95.0887 38.9971 92.5018 36 89.2498 36H88.4998C86.8416 36 85.4998 34.6582 85.4998 33C85.4998 31.3418 86.8416 30 88.4998 30Z" fill="url(#paint0_radial_64_1466)"/>
    <path d="M85.5 46.5C85.5 67.207 68.707 84 48 84C27.293 84 10.5 67.207 10.5 46.5C10.5 25.793 27.293 9 48 9C68.707 9 85.5 25.793 85.5 46.5Z" fill="url(#paint1_linear_64_1466)"/>
    <path d="M64.0426 32.5986L41.2496 55.418L33.3981 47.5898C31.9303 46.1279 29.5602 46.1309 28.0983 47.5928C26.6334 49.0576 26.6334 51.4365 28.1012 52.9014L38.6041 63.3779C40.069 64.8398 42.442 64.8369 43.9039 63.3721L69.3483 37.9014C70.8102 36.4336 70.8102 34.0605 69.3453 32.5986C67.8805 31.1338 65.5074 31.1338 64.0426 32.5986Z" fill="white"/>
    <defs>
    <radialGradient id="paint0_radial_64_1466" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(48.7498 47.25) scale(45.774)">
    <stop stop-color="white"/>
    <stop offset="0.193" stop-color="white"/>
    <stop offset="0.703" stop-color="white"/>
    <stop offset="1" stop-color="white"/>
    </radialGradient>
    <linearGradient id="paint1_linear_64_1466" x1="48" y1="9" x2="48" y2="84" gradientUnits="userSpaceOnUse">
    <stop stop-color="#42D778"/>
    <stop offset="0.996" stop-color="#34B171"/>
    <stop offset="1" stop-color="#34B171"/>
    </linearGradient>
    </defs>
    </svg>
    `,
    showCloseButton: true,
    customClass: {
      container: styles["container"],
      popup: [styles["popup"], styles["popup--success"]],
      closeButton: styles["close-button"],
      icon: styles["icon"],
      title: styles["title"],
      htmlContainer: styles["html-container"],
      actions: styles["actions"],
      confirmButton: [
        styles["confirm-button"],
        styles["confirm-button--success"],
      ],
    },
  });

  const { isConfirmed } = swalRes;
  return {
    isConfirmed,
  };
}

export async function fireError(textHtml, title = "Erro") {
  const swalRes = await Swal.fire({
    title,
    html: textHtml,
    iconHtml: `<svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M88 48C88 70.09 70.09 88 48 88C25.91 88 8 70.09 8 48C8 25.91 25.91 8 48 8C70.09 8 88 25.91 88 48Z" fill="url(#paint0_linear_64_1491)"/>
    <path opacity="0.05" d="M66.3838 57.9L56.4858 48L66.3858 38.1C67.9478 36.538 67.9478 34.006 66.3858 32.444L63.5578 29.616C61.9958 28.054 59.4638 28.054 57.9018 29.616L47.9998 39.514L38.0998 29.614C36.5378 28.052 34.0058 28.052 32.4438 29.614L29.6158 32.442C28.0538 34.004 28.0538 36.536 29.6158 38.098L39.5158 47.998L29.6158 57.898C28.0538 59.46 28.0538 61.992 29.6158 63.554L32.4438 66.382C34.0058 67.944 36.5378 67.944 38.0998 66.382L47.9998 56.482L57.8998 66.382C59.4618 67.944 61.9938 67.944 63.5558 66.382L66.3838 63.554C67.9458 61.994 67.9458 59.462 66.3838 57.9Z" fill="black"/>
    <path opacity="0.07" d="M65.6779 58.606L55.0719 48L65.6779 37.394C66.8499 36.222 66.8499 34.322 65.6779 33.152L62.8499 30.324C61.6779 29.152 59.7779 29.152 58.6079 30.324L47.9999 40.928L37.3939 30.322C36.2219 29.15 34.3219 29.15 33.1519 30.322L30.3239 33.15C29.1519 34.322 29.1519 36.222 30.3239 37.392L40.9279 48L30.3219 58.606C29.1499 59.778 29.1499 61.678 30.3219 62.848L33.1499 65.676C34.3219 66.848 36.2219 66.848 37.3919 65.676L47.9999 55.072L58.6059 65.678C59.7779 66.85 61.6779 66.85 62.8479 65.678L65.6759 62.85C66.8499 61.678 66.8499 59.778 65.6779 58.606Z" fill="black"/>
    <path d="M62.1419 31.03L64.9699 33.858C65.7519 34.64 65.7519 35.906 64.9699 36.686L36.6859 64.97C35.9039 65.752 34.6379 65.752 33.8579 64.97L31.0299 62.142C30.2479 61.36 30.2479 60.094 31.0299 59.314L59.3139 31.03C60.0939 30.248 61.3619 30.248 62.1419 31.03Z" fill="white"/>
    <path d="M64.9699 62.142L62.1419 64.97C61.3599 65.752 60.0939 65.752 59.3139 64.97L31.0299 36.686C30.2479 35.904 30.2479 34.638 31.0299 33.858L33.8579 31.03C34.6399 30.248 35.9059 30.248 36.6859 31.03L64.9699 59.314C65.7519 60.094 65.7519 61.362 64.9699 62.142Z" fill="white"/>
    <defs>
    <linearGradient id="paint0_linear_64_1491" x1="19.716" y1="19.716" x2="76.284" y2="76.284" gradientUnits="userSpaceOnUse">
    <stop stop-color="#F44F5A"/>
    <stop offset="0.443" stop-color="#EE3D4A"/>
    <stop offset="1" stop-color="#E52030"/>
    </linearGradient>
    </defs>
    </svg>
    `,
    showCloseButton: true,
    customClass: {
      container: styles["container"],
      popup: [styles["popup"], styles["popup--error"]],
      closeButton: styles["close-button"],
      icon: styles["icon"],
      title: styles["title"],
      htmlContainer: styles["html-container"],
      actions: styles["actions"],
      confirmButton: [
        styles["confirm-button"],
        styles["confirm-button--error"],
      ],
    },
  });

  const { isConfirmed } = swalRes;
  return {
    isConfirmed,
  };
}

export async function fireWarningConfirm(textHtml, title = "Alerta") {
  const swalRes = await Swal.fire({
    title,
    html: textHtml,
    iconHtml: `<svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M43.4368 17.9232C45.6871 14.0256 51.3129 14.0256 53.5632 17.9232L85.208 72.7337C87.4583 76.6313 84.6454 81.5033 80.1448 81.5033H16.8552C12.3546 81.5033 9.5417 76.6313 11.792 72.7337L43.4368 17.9232Z" fill="#FEB200"/>
    <path d="M43.9548 40.5254C43.7782 38.0529 45.7364 35.9498 48.2152 35.9498V35.9498C50.7241 35.9498 52.6927 38.1019 52.4696 40.6009L50.6635 60.8284C50.542 62.1898 49.4013 63.2332 48.0345 63.2332V63.2332C46.6497 63.2332 45.5003 62.163 45.4017 60.7817L43.9548 40.5254Z" fill="white"/>
    <circle cx="48.0128" cy="71.0285" r="3.41043" fill="white"/>
    </svg>
    `,
    showCloseButton: true,
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
    customClass: {
      container: styles["container"],
      popup: [styles["popup"], styles["popup--warning"]],
      closeButton: styles["close-button"],
      icon: styles["icon"],
      title: styles["title"],
      htmlContainer: styles["html-container"],
      actions: styles["actions"],
      confirmButton: [
        styles["confirm-button"],
        styles["confirm-button--warning"],
      ],
      cancelButton: styles["cancel-button"],
    },
  });

  const { isConfirmed } = swalRes;
  return {
    isConfirmed,
  };
}

export async function fireDangerConfirm(textHtml, title = "Alerta") {
  const swalRes = await Swal.fire({
    title,
    html: textHtml,
    iconHtml: `<svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M43.4368 17.9232C45.6871 14.0256 51.3129 14.0256 53.5632 17.9232L85.208 72.7337C87.4583 76.6313 84.6454 81.5033 80.1448 81.5033H16.8552C12.3546 81.5033 9.5417 76.6313 11.792 72.7337L43.4368 17.9232Z" fill="#FC665D"/>
    <path d="M43.9548 40.5254C43.7782 38.0529 45.7364 35.9498 48.2152 35.9498V35.9498C50.7241 35.9498 52.6927 38.1019 52.4696 40.6009L50.6635 60.8284C50.542 62.1898 49.4013 63.2332 48.0345 63.2332V63.2332C46.6497 63.2332 45.5003 62.163 45.4017 60.7817L43.9548 40.5254Z" fill="white"/>
    <circle cx="48.0128" cy="71.0285" r="3.41043" fill="white"/>
    </svg>
    `,
    showCloseButton: true,
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
    customClass: {
      container: styles["container"],
      popup: [styles["popup"], styles["popup--danger"]],
      closeButton: styles["close-button"],
      icon: styles["icon"],
      title: styles["title"],
      htmlContainer: styles["html-container"],
      actions: styles["actions"],
      confirmButton: [
        styles["confirm-button"],
        styles["confirm-button--danger"],
      ],
      cancelButton: styles["cancel-button"],
    },
  });

  const { isConfirmed } = swalRes;
  return {
    isConfirmed,
  };
}
