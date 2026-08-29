# The Soundbox, not the Server, de-duplicates Announcements

The Server may deliver the same Payment to a Soundbox more than once — PayMongo retries
deliveries, and catch-up after a disconnect re-sends recent Payments deliberately. We decided
the Server keeps **no** record of what it has sent, and the Soundbox refuses any Payment it has
already announced, keyed on the payment identifier.

The reason is that "this Payment was announced" is a fact only the Soundbox observes. A Server
that tracks sends is guessing at that fact across an unreliable link, and guesses wrong in the
dangerous direction: if the connection dies after the write but before delivery, the Server
records a send that never happened and the Payment is **never** announced — a silent miss, worse
than a duplicate and invisible in the logs.

## Considered options

- **Server-side tracking.** Rejected: the silent-miss case above.
- **Server checks the connection is alive before sending.** Rejected: it narrows the window but
  cannot close it (the connection can die between check and write), and a successful write proves
  only that bytes reached a kernel buffer — not that an Announcement happened.
- **Acknowledgements from the Soundbox.** This is the correct strong form, and it still needs a
  Soundbox-side set, because a lost acknowledgement makes the Server re-send. It is where the
  first two options end up after being fixed. We start at the destination instead: a `Set` of
  payment ids, and the Server is free to over-send.

## Consequences

The Soundbox's set is in memory, so "one Announcement per Payment" holds **per Soundbox process
lifetime**, not absolutely: restart a Soundbox and a replayed Payment is announced again. This is
acceptable — it is how a real 4G soundbox behaves when power-cycled, and for this POC it is the
mechanism that lets the demo loop re-run without paying for a new Payment. `CONTEXT.md` states
the guarantee in these scoped terms rather than promising more.

The Server still de-duplicates at its HTTP edge, on the PayMongo event id, because *that* is a
fact the Server owns: it received the delivery. Two invariants, each enforced by the process
that can observe it.
