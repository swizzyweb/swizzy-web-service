export type AssertMessageGenerator<T> = (args: T) => string;

/**
 * Props for performing assertions that throw.
 * <T> - args for evaluation
 */
export interface AssertOrThrowProps<ARGS> {
  /**
   * Args to use in assertion.
   */
  args: ARGS;

  /**
   * Assertion function that performs assertion.
   * @param args
   * @returns if assertion passed
   */
  assertion: (args: ARGS) => boolean;

  /**
   * Error message function or string to be included
   * in thrown exception.
   * @param args of assert for generating message
   * @returns error message to include in assertion exception
   */
  errorMessage?: AssertMessageGenerator<ARGS> | string;
}

/**
 * Asserts the assertion is true, else throws with provided
 * message or default message.
 * @param props for performing assertion
 */
export function assertOrThrow<T>(props: AssertOrThrowProps<T>): void {
  const { args, assertion, errorMessage } = props;
  if (!assertion(args)) {
    if (typeof errorMessage === "string") {
      throw new Error(errorMessage);
    } else if (typeof errorMessage === "function") {
      throw new Error(errorMessage(args));
    } else {
      throw new Error(`Assertion failed with args: ${JSON.stringify(args)}`);
    }
  }
}
