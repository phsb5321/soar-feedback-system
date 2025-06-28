// Domain Entity: Feedback
export class Feedback {
  constructor(
    public readonly id: string,
    public readonly message: string,
    public readonly type: "suggestion" | "complaint",
    public readonly anonymous: boolean = false
  ) {}
}
