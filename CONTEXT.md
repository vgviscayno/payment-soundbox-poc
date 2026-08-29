# Context

Glossary for the payment soundbox POC. Terms only — no implementation detail.

## Soundbox

The device that announces received payments in a store. In the real world, a small 4G speaker. Here, a **separate process** that connects to the Server, identifies itself, and prints Announcements as structured log lines. It knows nothing about PayMongo.

## Announcement

What the Soundbox emits when a Payment arrives: the amount, and enough context for a shopkeeper to recognise the payment — the time the money moved, the payer's bank, and the interbank reference. There is **no payer name**: none exists anywhere in the payment data, so a shopkeeper recognises a Payment by amount, time and reference, never by who sent it.

One Announcement per Payment, for as long as a given Soundbox keeps running — a repeat while it runs is a bug. A restarted Soundbox forgets what it announced, and may announce an old Payment again; a real 4G speaker behaves the same way when you cut its power.

## In-Store QR

The permanent, reusable QR Ph code created in the PayMongo dashboard and displayed at the store. It is **amount-less**: the payer types the amount into their own banking or e-wallet app after scanning. Distinct from a *Dynamic QR*, which encodes an amount, is single-use, and expires — out of scope for this POC.

## Payment

A completed transfer of money to the merchant against the In-Store QR. Originates as a PayMongo webhook event; the amount is chosen by the payer, not the merchant.

A Payment is also what crosses to the Soundbox — there is no separate term for it in transit. It crosses the boundary stripped of PayMongo: the Soundbox may carry an identifier through, but never reads meaning into one. Only Payments against the In-Store QR become Announcements; the merchant's other payment sources are silent.

## Server

The local process that receives PayMongo webhooks, verifies them, translates them into Payments, and fans them out to connected Soundboxes. The only component that knows PayMongo exists, and so the only place a webhook may be discarded — as a duplicate delivery, or as a Payment that did not come from the In-Store QR. It does not track which Payments were announced; that is the Soundbox's to know.

## Trigger

Whatever causes a Payment event to occur during a demo — a simulated one if PayMongo offers a handle for static QRs, otherwise a small real payment.
