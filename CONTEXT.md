# Context

Glossary for the payment soundbox POC. Terms only — no implementation detail.

## Soundbox

The device that announces received payments in a store. In the real world, a small 4G speaker. Here, a **separate process** that connects to the Server, identifies itself, and prints Announcements as structured log lines. It knows nothing about PayMongo.

## Announcement

What the Soundbox emits when a Payment arrives: the amount, and enough context for a shopkeeper to recognise the payment. One Announcement per Payment, exactly once — a repeated Announcement is a bug.

## In-Store QR

The permanent, reusable QR Ph code created in the PayMongo dashboard and displayed at the store. It is **amount-less**: the payer types the amount into their own banking or e-wallet app after scanning. Distinct from a *Dynamic QR*, which encodes an amount, is single-use, and expires — out of scope for this POC.

## Payment

A completed transfer of money to the merchant against the In-Store QR. Originates as a PayMongo webhook event; the amount is chosen by the payer, not the merchant.

## Server

The local process that receives PayMongo webhooks, verifies them, translates them into the internal event, and fans them out to connected Soundboxes. The only component that knows PayMongo exists.

## Trigger

Whatever causes a Payment event to occur during a demo — a simulated one if PayMongo offers a handle for static QRs, otherwise a small real payment.
