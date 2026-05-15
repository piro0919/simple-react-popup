"use client";

import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { PopupContext, usePopupContext } from "./context";

export type SimpleReactPopupProps = {
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function SimpleReactPopup({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: SimpleReactPopupProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const [triggerCount, setTriggerCount] = useState(0);
  const registerTrigger = useCallback(() => {
    setTriggerCount((c) => c + 1);
    return () => setTriggerCount((c) => c - 1);
  }, []);

  const reactId = useId();
  const value = useMemo(
    () => ({
      open,
      setOpen,
      contentId: `srp-content-${reactId}`,
      triggerId: `srp-trigger-${reactId}`,
      hasTrigger: triggerCount > 0,
      registerTrigger,
    }),
    [open, setOpen, reactId, triggerCount, registerTrigger],
  );

  return <PopupContext.Provider value={value}>{children}</PopupContext.Provider>;
}

export type TriggerProps = {
  children: ReactElement<{
    onClick?: (e: ReactMouseEvent) => void;
    id?: string;
    "aria-haspopup"?: "dialog";
    "aria-expanded"?: boolean;
    "aria-controls"?: string;
  }>;
};

function Trigger({ children }: TriggerProps) {
  const { open, setOpen, contentId, triggerId, registerTrigger } = usePopupContext("Trigger");

  useEffect(() => registerTrigger(), [registerTrigger]);

  if (!isValidElement(children)) {
    throw new Error("<SimpleReactPopup.Trigger> expects a single React element child.");
  }

  const childOnClick = children.props.onClick;

  return cloneElement(children, {
    id: triggerId,
    "aria-haspopup": "dialog",
    "aria-expanded": open,
    "aria-controls": contentId,
    onClick: (e: ReactMouseEvent) => {
      childOnClick?.(e);
      if (!e.defaultPrevented) setOpen(!open);
    },
  });
}

export type ContentProps = {
  children: ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  lockScroll?: boolean;
  overlayClassName?: string;
};

function Content({
  children,
  className,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  lockScroll = true,
  overlayClassName,
}: ContentProps) {
  const { open, setOpen, contentId, triggerId, hasTrigger } = usePopupContext("Content");
  const contentRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeOnEsc, setOpen]);

  useEffect(() => {
    if (!open || !lockScroll) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open, lockScroll]);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = (document.activeElement as HTMLElement) ?? null;
    const node = contentRef.current;
    if (node) {
      const focusable = node.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      (focusable ?? node).focus();
    }
    return () => {
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  const handleFocusTrap = useCallback((e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const node = contentRef.current;
    if (!node) return;
    const focusables = node.querySelectorAll<HTMLElement>(
      'button, [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusables[0]!;
    const last = focusables[focusables.length - 1]!;
    const active = document.activeElement as HTMLElement | null;
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  if (!mounted || !open) return null;

  const overlayStyle = {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(0, 0, 0, 0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5999999,
  };

  return createPortal(
    <div
      data-state={open ? "open" : "closed"}
      className={overlayClassName}
      style={overlayClassName ? undefined : overlayStyle}
      onClick={(e) => {
        if (!closeOnOverlayClick) return;
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div
        ref={contentRef}
        id={contentId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={hasTrigger ? triggerId : undefined}
        tabIndex={-1}
        data-state={open ? "open" : "closed"}
        className={className}
        onKeyDown={handleFocusTrap}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

export type CloseProps = {
  children: ReactElement<{ onClick?: (e: ReactMouseEvent) => void }>;
};

function Close({ children }: CloseProps) {
  const { setOpen } = usePopupContext("Close");

  if (!isValidElement(children)) {
    throw new Error("<SimpleReactPopup.Close> expects a single React element child.");
  }

  const childOnClick = children.props.onClick;

  return cloneElement(children, {
    onClick: (e: ReactMouseEvent) => {
      childOnClick?.(e);
      if (!e.defaultPrevented) setOpen(false);
    },
  });
}

SimpleReactPopup.Trigger = Trigger;
SimpleReactPopup.Content = Content;
SimpleReactPopup.Close = Close;
