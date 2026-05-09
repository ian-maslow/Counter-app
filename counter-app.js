/**
 * Copyright 2026 ian-maslow
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `counter-app`
 * A simple counter web component with min/max bounds,
 * color changes at key values, and confetti at 21.
 *
 * @demo index.html
 * @element counter-app
 */
export class CounterApp extends DDDSuper(I18NMixin(LitElement)) {

  // Returns the custom element tag name
  static get tag() {
    return "counter-app";
  }

  // Sets default property values when the element is created
  constructor() {
    super();
    this.counter = 0;
    this.min = 0;
    this.max = 100;
    this.title = "";
  }

  // Declares reactive properties — Lit watches these and re-renders when they change
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      counter: { type: Number, reflect: true },
      min: { type: Number, reflect: true },
      max: { type: Number, reflect: true },
    };
  }

  // All CSS styles for this component, using DDD design system variables
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
          color: var(--ddd-theme-primary);
          background-color: var(--ddd-theme-accent);
          font-family: var(--ddd-font-navigation);
          padding: var(--ddd-spacing-4);
          border-radius: var(--ddd-radius-lg);
        }

        /* Large number display */
        .number {
          font-size: var(--ddd-font-size-4xl);
          font-weight: bold;
          margin: var(--ddd-spacing-2) 0;
          color: var(--ddd-theme-primary);
          transition: color 0.3s ease;
        }

        /* Color change when counter hits 18 */
        :host([counter="18"]) .number {
          color: var(--ddd-theme-default-landgrantBrown);
        }

        /* Color change when counter hits 21 */
        :host([counter="21"]) .number {
          color: var(--ddd-theme-default-athertonViolet);
        }

        /* Color change when at min or max */
        :host([at-min]) .number,
        :host([at-max]) .number {
          color: var(--ddd-theme-default-original87Pink);
        }

        /* Button row — side by side below the number */
        .controls {
          display: flex;
          gap: var(--ddd-spacing-4);
          justify-content: center;
          margin-top: var(--ddd-spacing-4);
        }

        /* Button base styles */
        button {
          font-size: var(--ddd-font-size-m);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-6);
          border: 2px solid var(--ddd-theme-primary);
          border-radius: var(--ddd-radius-sm);
          background: transparent;
          color: var(--ddd-theme-primary);
          cursor: pointer;
          transition: background-color 0.2s ease, color 0.2s ease, transform 120ms ease;
        }

        /* Hover state */
        button:hover:not([disabled]) {
          background-color: var(--ddd-theme-primary);
          color: white;
          transform: translateY(-2px);
        }

        /* Focus state for accessibility */
        button:focus-visible {
          outline: 3px solid var(--ddd-theme-default-athertonViolet);
          outline-offset: 2px;
        }

        /* Disabled state */
        button[disabled] {
          opacity: 0.35;
          cursor: not-allowed;
        }

        /* Slot area for optional extra content */
        .extras {
          margin-top: var(--ddd-spacing-4);
        }
      `,
    ];
  }

  /**
   * Renders the component's HTML into the shadow DOM.
   * Shows the counter number, - and + buttons, and a slot for extra content.
   */
  render() {
    return html`
      <confetti-container id="confetti">
        <div class="number">${this.counter}</div>
        <div class="controls">
          <button
            @click="${this.decrement}"
            ?disabled="${this.counter === this.min}"
          >-</button>
          <button
            @click="${this.increment}"
            ?disabled="${this.counter === this.max}"
          >+</button>
        </div>
        <div class="extras">
          <slot></slot>
        </div>
      </confetti-container>
    `;
  }

  /**
   * Runs before each render update.
   * Ensures counter, min, and max values are always in a valid range.
   */
  willUpdate(changedProperties) {
    if (this.min > this.max) {
      var temp = this.min;
      this.min = this.max;
      this.max = temp;
    }
    if (this.counter < this.min) { this.counter = this.min; }
    if (this.counter > this.max) { this.counter = this.max; }
    if (super.willUpdate) { super.willUpdate(changedProperties); }
  }

  /**
   * Runs after every update/render.
   * Toggles at-min / at-max attributes for CSS styling,
   * and triggers confetti when the counter reaches 21.
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("counter")) {
      this.toggleAttribute("at-min", this.counter === this.min);
      this.toggleAttribute("at-max", this.counter === this.max);

      if (this.counter === 21) {
        this.makeItRain();
      }
    }
  }

  /**
   * Increases the counter by 1.
   * The button is disabled at max so this won't go over.
   */
  increment() {
    this.counter++;
  }

  /**
   * Decreases the counter by 1.
   * The button is disabled at min so this won't go below.
   */
  decrement() {
    this.counter--;
  }

  /**
   * Dynamically imports the confetti element and fires the animation.
   * Only loads the confetti code when actually needed (at 21).
   */
  makeItRain() {
    import("@haxtheweb/multiple-choice/lib/confetti-container.js").then(function() {
      setTimeout(function() {
        var confetti = this.shadowRoot && this.shadowRoot.querySelector("#confetti");
        if (confetti) {
          confetti.setAttribute("popped", "");
        }
      }.bind(this), 0);
    }.bind(this));
  }

  /**
   * HAX editor integration — points to the haxProperties config file
   */
  static get haxProperties() {
    return new URL("./lib/" + CounterApp.tag + ".haxProperties.json", import.meta.url).href;
  }
}

globalThis.customElements.define(CounterApp.tag, CounterApp);