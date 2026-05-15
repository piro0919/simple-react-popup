import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { SimpleReactPopup } from "../src";

function Basic() {
  return (
    <SimpleReactPopup>
      <SimpleReactPopup.Trigger>
        <button>open</button>
      </SimpleReactPopup.Trigger>
      <SimpleReactPopup.Content>
        <p>popup body</p>
        <SimpleReactPopup.Close>
          <button>close</button>
        </SimpleReactPopup.Close>
      </SimpleReactPopup.Content>
    </SimpleReactPopup>
  );
}

describe("SimpleReactPopup", () => {
  it("does not render content by default", () => {
    render(<Basic />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.click(screen.getByRole("button", { name: "open" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("popup body")).toBeInTheDocument();
  });

  it("closes when Close child is clicked", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.click(screen.getByRole("button", { name: "open" }));
    await user.click(screen.getByRole("button", { name: "close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes on Escape key when closeOnEsc is enabled (default)", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.click(screen.getByRole("button", { name: "open" }));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("does not close on Escape when closeOnEsc is false", async () => {
    const user = userEvent.setup();
    render(
      <SimpleReactPopup defaultOpen>
        <SimpleReactPopup.Trigger>
          <button>open</button>
        </SimpleReactPopup.Trigger>
        <SimpleReactPopup.Content closeOnEsc={false}>
          <p>body</p>
        </SimpleReactPopup.Content>
      </SimpleReactPopup>,
    );
    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("supports controlled mode via open + onOpenChange", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <SimpleReactPopup
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        >
          <SimpleReactPopup.Trigger>
            <button>open</button>
          </SimpleReactPopup.Trigger>
          <SimpleReactPopup.Content>
            <p>body</p>
          </SimpleReactPopup.Content>
        </SimpleReactPopup>
      );
    }

    render(<Controlled />);
    await user.click(screen.getByRole("button", { name: "open" }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("renders with defaultOpen=true", () => {
    render(
      <SimpleReactPopup defaultOpen>
        <SimpleReactPopup.Trigger>
          <button>open</button>
        </SimpleReactPopup.Trigger>
        <SimpleReactPopup.Content>
          <p>body</p>
        </SimpleReactPopup.Content>
      </SimpleReactPopup>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("sets aria-expanded on trigger reflecting open state", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    const trigger = screen.getByRole("button", { name: "open" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("locks body scroll while open", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    expect(document.body.style.overflow).toBe("");
    await user.click(screen.getByRole("button", { name: "open" }));
    expect(document.body.style.overflow).toBe("hidden");
    await user.click(screen.getByRole("button", { name: "close" }));
    expect(document.body.style.overflow).toBe("");
  });

  it("omits aria-labelledby when no Trigger is rendered", () => {
    render(
      <SimpleReactPopup defaultOpen>
        <SimpleReactPopup.Content>
          <p>body</p>
        </SimpleReactPopup.Content>
      </SimpleReactPopup>,
    );
    expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-labelledby");
  });

  it("sets aria-labelledby when a Trigger is rendered", async () => {
    const user = userEvent.setup();
    render(<Basic />);
    await user.click(screen.getByRole("button", { name: "open" }));
    const dialog = screen.getByRole("dialog");
    const trigger = screen.getByRole("button", { name: "open" });
    expect(dialog).toHaveAttribute("aria-labelledby", trigger.id);
  });

  it("throws when subcomponent is rendered outside SimpleReactPopup", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <SimpleReactPopup.Trigger>
          <button>x</button>
        </SimpleReactPopup.Trigger>,
      ),
    ).toThrow(/must be rendered inside <SimpleReactPopup>/);
    spy.mockRestore();
  });
});
