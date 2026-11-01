const AUTHOR = 'author_octis_editorial';

function post(fields) {
  return {
    status: 'published',
    featured: false,
    seoTitle: '',
    seoDescription: '',
    keywords: [],
    authorId: AUTHOR,
    createdAt: fields.publishedAt,
    updatedAt: fields.publishedAt,
    ...fields,
  };
}

/** A short starting set. Added once, only while the library is empty. */
export function starterPosts() {
  return [
    post({
      id: 'post_tag_weights',
      title: 'What a jewellery tag has to carry',
      slug: 'what-a-jewellery-tag-has-to-carry',
      excerpt: 'Gross weight, stone weight, and net weight are not three ways of saying the same thing. The tag and the invoice have to agree.',
      categoryId: 'cat_jewellery-technology',
      coverImage: '/landing/pos-billing-editorial.jpg',
      featured: true,
      keywords: ['jewellery tag', 'net weight', 'HUID'],
      seoTitle: 'What a jewellery tag has to carry',
      seoDescription: 'Gross, stone, and net weight, plus HUID, belong on the same showroom record as the invoice.',
      publishedAt: '2026-10-18T06:30:00.000Z',
      content: `A showroom tag is a small record. It has to survive the counter, the vault, and the bill.

Gross weight is the piece as it sits on the scale, stones and findings included. Stone weight is what you deduct. Net weight is the metal you are actually pricing. If those three numbers live in different notebooks, the invoice will eventually disagree with the tray.

Hallmarking adds another field. A BIS HUID identifies the piece that was hallmarked. It belongs on the same record as the weights, not in a folder of certificates that nobody opens at billing time.

The tag should also say what the piece is: the item, the purity, and a code the counter can scan. The person billing should not have to retype a weight that was already taken when the piece was tagged.

## What to check on the next ten tags

- Gross, stone, and net weight are all present
- Purity matches the piece, not a default left over from the last item
- The HUID, when the piece has one, is on the tag and can be printed on the invoice
- The tag code opens that same record at the counter`,
    }),
    post({
      id: 'post_loan_to_value',
      title: 'Loan-to-value starts with the metal',
      slug: 'loan-to-value-starts-with-the-metal',
      excerpt: 'A gold-loan figure is only as good as the weight, purity, and rate underneath it. The ceiling is the last step, not the first.',
      categoryId: 'cat_pawn-industry',
      coverImage: '/landing/inventory-traceability-editorial.jpg',
      keywords: ['gold loan', 'loan to value', 'appraisal'],
      seoTitle: 'Loan-to-value starts with the metal',
      seoDescription: 'Weight, purity, and the day’s rate come before any loan-to-value ceiling on a gold pledge.',
      publishedAt: '2026-10-22T06:30:00.000Z',
      content: `Loan-to-value is the loan amount divided by the value of the gold or silver pledged. The arithmetic is short. The work is in the value.

Value starts with the items on the desk. Each piece is weighed, purity is judged, and stones are kept apart from metal. A rate is applied after that. Only then does a ceiling matter.

For a regulated lender, the Reserve Bank of India sets a maximum loan-to-value, and that maximum has been revised before. Use the limit that applies to that lender now, not a percentage remembered from an older circular. An informal girvi counter and a regulated gold-loan company are not the same business. One rule sheet copied onto the other produces confident, wrong loans.

Repayment needs the same care. Charges, interest, and principal are not interchangeable. If the receipt does not say which part of the payment cleared which balance, the next visit starts an argument.

## Before the pledge slip is printed

- Each item has its own weight and purity
- The rate used is the rate for that day, and it is written down
- The loan stays inside the ceiling that applies to this lender
- The customer can see weight, value, and the amount disbursed on one slip`,
    }),
    post({
      id: 'post_available_to_sell',
      title: 'Metal in the vault is not metal you can still sell',
      slug: 'metal-in-the-vault-is-not-metal-you-can-still-sell',
      excerpt: 'A bullion desk needs two quantities: what is physically there, and what is still free to promise.',
      categoryId: 'cat_bullion-precious-metals',
      coverImage: '',
      keywords: ['bullion', 'available to sell', 'rate lock'],
      seoTitle: 'Metal in the vault is not metal you can still sell',
      seoDescription: 'Physical stock and available-to-sell are different numbers. Rate locks and pending deliveries sit between them.',
      publishedAt: '2026-10-28T06:30:00.000Z',
      content: `A vault count answers one question: how much metal is in the building? A sale answers another: how much of that metal is still unpromised?

Rate locks, pending deliveries, and metal already sold but not yet handed over all sit on the same bars. Sell from the vault total, and the same kilo can be sold twice. Available-to-sell is what remains after those holds.

The rate on a deal is a second record. A customer lock expires. After it expires, the old rate should not still be treated as live. Premium and discount belong beside the reference rate, so a later reader can see why the invoice did not match the board.

Settlement is where the two records meet. The receipt says what moved. The stock ledger should change by that amount, not by a rounded guess.

## A close-of-day check

- Physical stock and available-to-sell are both on the page, and they are not the same number
- Open rate locks show an expiry, not only a rate
- Nothing on the book has gone negative
- Each buy or sell can be traced to a delivery or a receipt`,
    }),
  ];
}
