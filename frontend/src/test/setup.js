import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

import useStore, { defaultStoreState } from "../store/useStore";

afterEach(() => {
  cleanup();
  useStore.setState({ ...defaultStoreState });
});
