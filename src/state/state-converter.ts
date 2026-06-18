/**
 * Properties passed to a `StateConverter` function.
 * @template IN_STATE the input state type to convert from
 */
export interface StateConverterProps<IN_STATE> {
  state: IN_STATE;
  [key: string]: any;
}

/**
 * Async function that converts one state shape into another.
 * Used for the following state propagation chain:
 * - `WebService` → `WebRouter`
 * - `WebRouter` → `WebController`
 *
 * @template IN_STATE the source state type
 * @template OUT_STATE the resulting state type
 */
export type StateConverter<IN_STATE, OUT_STATE> = (
  props: StateConverterProps<IN_STATE>,
) => Promise<OUT_STATE>;

/**
 * Default state converter — passes the input state through unchanged.
 * Use when the router or controller state is identical to the parent state.
 * @param inState input state wrapper
 * @returns the same state cast to `OUT_STATE`
 */
export async function DefaultStateExporter<IN_STATE, OUT_STATE>(
  inState: StateConverterProps<IN_STATE>,
): Promise<OUT_STATE> {
  const { state } = inState;
  return state as any as OUT_STATE;
}

/**
 * State converter that copies matching properties from the input state into the output state.
 * The input type must extend the output type (structural subtyping).
 * Example: `{a: 1, b: 2, c: 3}` → `{a: 1, c: 3}` when `OUT_STATE` only has `a` and `c`.
 * @param inState input state wrapper
 * @returns a shallow copy of the input spread into `OUT_STATE`
 */
export async function InheritedStateExporter<
  IN_STATE extends OUT_STATE,
  OUT_STATE,
>(inState: StateConverterProps<IN_STATE>): Promise<OUT_STATE> {
  const { state } = inState;
  return { ...state };
}
