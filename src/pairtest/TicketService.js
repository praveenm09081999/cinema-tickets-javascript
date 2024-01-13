import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from './../thirdparty/paymentgateway/TicketPaymentService.js';
import SeatReservationService from './../thirdparty/seatbooking/SeatReservationService.js';
export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */
  /**
   * Validate the ticket purchase.
   * @param {number} accountId - The account id.
   * @param {number[]} ticketTypeRequests - An array of integers representing counts of adult, child and infant respectively.
   * The Array of Integers should be in order of ADULT, CHILD and INFANT.
   * @throws {InvalidPurchaseException} - If the purchase request is invalid.
   * @private
   */
  purchaseTickets(accountId,...ticketTypeRequests) {


    // Validate ticket purchase.
    this.#validateTicketPurchase(accountId,ticketTypeRequests);

    //Declare Adult,Child and Infant counts
    const adultCount = ticketTypeRequests[0] > 0 ? ticketTypeRequests[0] : 0
    const childCount = ticketTypeRequests[1] > 0 ? ticketTypeRequests[1] : 0
    const infantCount = ticketTypeRequests[2] > 0 ? ticketTypeRequests[2] : 0

    const totalNumberOfTickets = adultCount + childCount + infantCount;

    // Seats are not allocated to infants.
    const totalNumberOfSeats = adultCount + childCount;

    // Log condition checks.
    this.#logConditionChecks(totalNumberOfTickets, totalNumberOfSeats);

    // Create ticket objects.
    const adultTicket = new TicketTypeRequest('ADULT', adultCount);
    const childTicket = childCount > 0 ? new TicketTypeRequest('CHILD', childCount) : null;
    const infantTicket = infantCount > 0 ? new TicketTypeRequest('INFANT', infantCount) : null;

    // Calculate total amount to pay.
    const totalAmountToPay = this.#calculateTotalAmount(adultCount, childCount);

    // Log total amount to pay.
    console.log("Total amount to pay is ", totalAmountToPay);

    // Make payment and reserve seats.
    this.#processPaymentAndReservation(accountId, totalAmountToPay, totalNumberOfSeats);

    return {
      success: true,
      message: "Tickets booked successfully",
      TotalAmount: totalAmountToPay,
      TotalNumberOfTickets: totalNumberOfTickets,
      TotalNumberOfSeats: totalNumberOfSeats,
    };
  }

  /**
   * Validate the ticket purchase.
   * @param {number} accountId - The account id.
   * @param {number[]} totalNumberOfTickets - An array of Intergers representing counts of adult, child and infant respectively.
   * @throws {InvalidPurchaseException} - If the purchase is invalid.
   * @private
   */
  #validateTicketPurchase(accountId,ticketTypeRequests) {
    const adultCount = ticketTypeRequests[0]
    const childCount = ticketTypeRequests[1]
    const infantCount = ticketTypeRequests[2]
    if (!Number.isInteger(accountId)) {
      throw new TypeError('accountId must be an integer');
    }

    if((adultCount || adultCount===false) && (!Number.isInteger(adultCount) || adultCount < 0)){
      throw new InvalidPurchaseException("Adult count should be a valid number")
    }

    if((childCount || childCount===false) && (!Number.isInteger(childCount) || childCount < 0)){
      throw new InvalidPurchaseException("Child count should be a whole number")
    }
    
    if((infantCount || infantCount===false) && (!Number.isInteger(infantCount) || infantCount < 0)){
      throw new InvalidPurchaseException("Infant count should be a whole number")
    }

    if (adultCount === 0) {
      throw new InvalidPurchaseException("Tickets must include at least 1 adult");
    }
    const totalNumberOfTickets = adultCount+childCount+infantCount
    if (totalNumberOfTickets > 20) {
      throw new InvalidPurchaseException("Sorry, You cannot purchase more than 20 tickets");
    }
  }

  /**
   * Log condition checks.
   * @param {number} totalNumberOfTickets - The total number of tickets.
   * @param {number} totalNumberOfSeats - The total number of seats.
   * @private
   */
  #logConditionChecks(totalNumberOfTickets, totalNumberOfSeats) {
    console.log("Condition checks passed");
    console.log("Total number of tickets is ", totalNumberOfTickets);
    console.log("Total number of seats is ", totalNumberOfSeats);
  }

  /**
   * Calculate total amount to pay.
   * @param {number} adultCount - The number of adult tickets.
   * @param {number} childCount - The number of child tickets.
   * @returns {number} - The total amount to pay.
   * @private
   */
  #calculateTotalAmount(adultCount, childCount) {
    return adultCount * 20 + (childCount > 0 ? childCount * 10 : 0);
  }

  /**
   * Process payment and seat reservation.
   * @param {number} accountId - The account ID.
   * @param {number} totalAmountToPay - The total amount to pay.
   * @param {number} totalNumberOfSeats - The total number of seats.
   * @private
   */
  #processPaymentAndReservation(accountId, totalAmountToPay, totalNumberOfSeats) {
    const ticketPayment = new TicketPaymentService();
    const seatReservation = new SeatReservationService();

    // Make payment and reserve seats.
    ticketPayment.makePayment(accountId, totalAmountToPay);
    seatReservation.reserveSeat(accountId, totalNumberOfSeats);
  }
}
