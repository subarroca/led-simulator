import { StripOrientation } from "./util";
import { BehaviorSubject, Observable, from } from "rxjs";

export class Menu {
  private orientationChangeSubject = new BehaviorSubject<StripOrientation>(
    StripOrientation.HORIZONTAL
  );
  orientationChange: Observable<StripOrientation> = from(
    this.orientationChangeSubject
  );
  private modeChangeSubject = new BehaviorSubject<string>("rainbowGradient");
  modeChange: Observable<string> = from(this.modeChangeSubject);

  constructor() {
    this.initMenu();
    this.initOrientation();
    this.initMode();
  }

  initMenu() {
    const menu = document.querySelector("menu");

    if (menu) menu.style.display = "block";
  }

  // Orientation

  initOrientation() {
    this.orientation = this.orientation;

    const orientationBtn: HTMLButtonElement | null = document.querySelector(
      "#orientation-toggle"
    );
    if (orientationBtn)
      orientationBtn.addEventListener(
        "click",
        () =>
          (this.orientation =
            this.orientation === StripOrientation.HORIZONTAL
              ? StripOrientation.VERTICAL
              : StripOrientation.HORIZONTAL)
      );
  }

  get orientation(): StripOrientation {
    return (
      (localStorage.getItem("orientation") as StripOrientation) ||
      StripOrientation.HORIZONTAL
    );
  }
  set orientation(orientation) {
    localStorage.setItem("orientation", orientation);
    const body = document.querySelector("body");
    if (body) {
      body.classList.remove(`orientation-${StripOrientation.HORIZONTAL}`);
      body.classList.remove(`orientation-${StripOrientation.VERTICAL}`);
      body.classList.add(`orientation-${orientation}`);
    }
    this.orientationChangeSubject.next(this.orientation);
  }

  // Modes
  initMode() {
    this.mode = this.mode;

    (document.querySelectorAll("#modes button") as NodeListOf<
      HTMLButtonElement
    >).forEach((btn: HTMLButtonElement) => {
      btn.addEventListener("click", () => (this.mode = btn.dataset.mode || ""));
    });
  }

  get mode(): string {
    return localStorage.getItem("mode") || "rainbowGradient";
  }
  set mode(mode) {
    localStorage.setItem("mode", mode);
    this.modeChangeSubject.next(this.mode);
  }
}
