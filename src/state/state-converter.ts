/**
 * State converter prooerties.
 */
export interface StateConverterProps<IN_STATE> {
  state: IN_STATE;
  [key: string]: any;
}

/**
 * Converts one state to another. used for
 * WebService -> WebRouter
 * WebRouter -> Controller
 * state conversions.
 */
export type StateConverter<IN_STATE, OUT_STATE> = (
  props: StateConverterProps<IN_STATE>,
) => Promise<OUT_STATE>;

/**
 * Directly returns the input state, no validation.
 */
export async function DefaultStateExporter<IN_STATE, OUT_STATE>(
  inState: StateConverterProps<IN_STATE>,
): Promise<OUT_STATE> {
  const { state } = inState;
  return state as any as OUT_STATE;
}

/**
 * Simple state converter that directly translates the input to output
 * with mathing parameters.
 * ie: {a: 1, b: 2, c: 3} -> {a: 1, c: 3}
 */
export async function InheritedStateExporter<
  IN_STATE extends OUT_STATE,
  OUT_STATE,
>(inState: StateConverterProps<IN_STATE>): Promise<OUT_STATE> {
  const { state } = inState;
  return { ...state };
}
