# Room Reservation

## Scope

This project is a RESTful API that allows users to manage room reservations. Users can view available rooms, make reservations, cancel reservations, and retrieve details of their reservations.

## Features

### Room Management
- **Create Room:** Admins can create new rooms with details like room number, type, and capacity.
- **Update Room:** Modify the details of existing rooms.
- **Delete Room:** Remove rooms from the system.
- **Set Availability:** Admins can update the availability status of rooms, making them available or unavailable as needed.

### Reservation Functionality
- **Create Reservation:** Users can reserve available rooms for specified dates.
- **Cancel Reservation:** Users can cancel their existing reservations.

### User Management
- **User Registration:** Users can register by creating a new user account.
- **User Login:** Users can log in to the system, which is essential for actions like making reservations.

### Pricing Strategies
- The system includes dynamic pricing strategies based on various factors:
    - **Date-Based Pricing:** Different prices for weekdays and weekends.
    - **Occupancy-Based Pricing:** Prices can vary based on the number of guests, with additional charges for extra guests beyond the room’s capacity.
    - These pricing strategies ensure flexible and optimized pricing for both users and the hotel management.


## Technologies

- **Back end Framework:** LoopBack 4
- **Database:** PostgresSQL
- **Authentication:** JWT (JSON Web Tokens)
- **Testing:** Mocha

## Usage

### Installation

Clone the repository

```sh
git clone https://github.com/thebozturk/room-reservation.git
```

Go to the project directory

```sh
cd room-reservation
```

Install dependencies

```sh
npm install
```
Run the application

```sh
npm start
```

### Testing

Run unit tests

```sh
npm run test
```

Coverage report

```sh
npm run test:coverage
```

## Postman Collection

https://api.postman.com/collections/16077961-e02237b5-d869-483b-80f7-53a750e622b2?access_key=PMAT-01HMEDQY3Z8XQ4A9WPYBKE49ZN