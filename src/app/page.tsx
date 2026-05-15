"use client";

import { useState } from "react";
import { SimpleReactPopup } from "@/components/SimpleReactPopup";

export default function Home() {
  const [controlledOpen, setControlledOpen] = useState(false);

  return (
    <div className="container">
      <h1 className="title">simple-react-popup</h1>
      <p className="subtitle">Headless, compound popup component for React.</p>

      <section className="section">
        <h2>Basic</h2>
        <p>
          Uncontrolled usage with <code>Trigger</code> / <code>Content</code> / <code>Close</code>.
        </p>
        <SimpleReactPopup>
          <SimpleReactPopup.Trigger>
            <button className="btn" type="button">
              Open popup
            </button>
          </SimpleReactPopup.Trigger>
          <SimpleReactPopup.Content>
            <div className="popup-box">
              <h3>Hello</h3>
              <p>This is a popup body. Click the overlay, press ESC, or use the Close button.</p>
              <div className="popup-actions">
                <SimpleReactPopup.Close>
                  <button className="btn secondary" type="button">
                    Cancel
                  </button>
                </SimpleReactPopup.Close>
                <SimpleReactPopup.Close>
                  <button className="btn" type="button">
                    OK
                  </button>
                </SimpleReactPopup.Close>
              </div>
            </div>
          </SimpleReactPopup.Content>
        </SimpleReactPopup>
      </section>

      <section className="section">
        <h2>Controlled</h2>
        <p>
          Driven by external state via <code>open</code> and <code>onOpenChange</code>.
        </p>
        <button className="btn" onClick={() => setControlledOpen(true)} type="button">
          Open (controlled)
        </button>
        <SimpleReactPopup open={controlledOpen} onOpenChange={setControlledOpen}>
          <SimpleReactPopup.Content>
            <div className="popup-box">
              <h3>Controlled popup</h3>
              <p>
                State lives in the parent. Closing this fires <code>onOpenChange(false)</code>.
              </p>
              <div className="popup-actions">
                <SimpleReactPopup.Close>
                  <button className="btn" type="button">
                    Close
                  </button>
                </SimpleReactPopup.Close>
              </div>
            </div>
          </SimpleReactPopup.Content>
        </SimpleReactPopup>
      </section>

      <section className="section">
        <h2>Disable defaults</h2>
        <p>
          <code>closeOnOverlayClick={"{false}"}</code> and <code>closeOnEsc={"{false}"}</code>{" "}
          require the Close button.
        </p>
        <SimpleReactPopup>
          <SimpleReactPopup.Trigger>
            <button className="btn" type="button">
              Open (locked)
            </button>
          </SimpleReactPopup.Trigger>
          <SimpleReactPopup.Content closeOnOverlayClick={false} closeOnEsc={false}>
            <div className="popup-box">
              <h3>Forced choice</h3>
              <p>You can only close this with the button below.</p>
              <div className="popup-actions">
                <SimpleReactPopup.Close>
                  <button className="btn" type="button">
                    Got it
                  </button>
                </SimpleReactPopup.Close>
              </div>
            </div>
          </SimpleReactPopup.Content>
        </SimpleReactPopup>
      </section>

      <a
        className="github-link"
        href="https://github.com/piro0919/simple-react-popup"
        rel="noopener noreferrer"
        target="_blank"
      >
        GitHub →
      </a>
    </div>
  );
}
