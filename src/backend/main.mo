// Kilo ICP Backend
// Simple site stats canister for the Kilo marketing site.
// Tracks page views and signups via stable storage.

import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Array "mo:base/Array";

persistent actor KiloSite {

  // --- State ---

  var pageViews : Nat = 0;
  var waitlistCount : Nat = 0;

  // --- Queries ---

  public query func getStats() : async { pageViews : Nat; waitlistCount : Nat } {
    { pageViews; waitlistCount }
  };

  public query func getPageViews() : async Nat {
    pageViews
  };

  public query func getWaitlistCount() : async Nat {
    waitlistCount
  };

  // --- Updates ---

  public func recordPageView() : async () {
    pageViews += 1;
  };

  public func joinWaitlist() : async Nat {
    waitlistCount += 1;
    waitlistCount
  };

}
