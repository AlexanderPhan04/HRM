
 
 
PROJECT REPORT 
Esport Manager



Semester: 
Programming Fundamentals
Class: 
PF1127
Group: 
ProjectReportFile_G1
Instructor: 
Tran Phong Vuong
Group Members: 
Phan Nhat Quan
Dang Tien Dat
Hoang Tien Dat
Cao Xuan Minh
 

 
 


Index
Project Introduction
Proposed System
Scope of the Project
System Name
Deployment Environment
Development Tools
Customer Requirements
Analyze System Requirements
Use Case Diagram
Activity Diagram
Design Details
UI Design
Code Design (Class Diagram)
Sequence Diagram
Database Design
Entity Relationship Diagram
Database Design Details
Test
Task Assignment
Installation Instructions
Deployment Diagram
Installation Steps
Install Database
Install Server
Install Application
Appendix
Terms and Abbreviations
References
Other Issues

Project Introduction 
The EsportManager System is a console-based application designed to manage esports tournaments, supporting three user roles: Admin, Player, and Viewer. It provides functionalities for account management, tournament registration, team collaboration, e-wallet donations, voting, feedback, and performance tracking. Built with a 3-layer architecture (UI, BL, DAL) and utilizing a SQL database (MySQL or SQL Server), the system ensures secure and efficient management of esports events. 
Proposed System 
The system enables: 
Admin: Manage tournaments, approve user accounts, teams, and role change requests, assign achievements, and view statistics (donation profits, voting results, feedback). 
Player: Register for tournaments, create/join teams, manage donation wallets, submit feedback, and view personal statistics. 
Viewer: View tournaments, donate to players, vote for players/tournaments/sports, and manage e-wallets 
The Scope of the Project to be Applied  
Support Admin, Player and Viewer roles. 
Manage users, tournaments, team, wallets, donations, feedback and achievement. 
Enable secure registration, login, role switching and password management. 
Provide voting, donation tracking and statistical reporting. 
System Name 
Esport Manager System 
Deployment Environment 
Window 
.Net Runtime installed 
MySQL 
Development Tools 
Language: C# (Console Application) 
Database: MySQL 
Architecture: 3-layered (UI, BL, DAL) 
Tools: Visual Studio Code, MySQL Workbench, Draw.io (for diagrams) 
Customer Requirements 
Manage tournaments and user securely 
Provide user-friendly console interface 
Allow donation and reward management 
Include voting features and statistics 


Analyze System Requirements 	
 
Use Case 
















1.1 Use Case Overview 
Use Case Name 
Register Account  
Use Case ID 
UC01 


Description 
Allows Player/Viewer to register with profile and security information. 
Actor 
Player/ Viewer
Organizational Benefits 
Expands user base with role-specific access and secure account creation
Triggers 
User selects the "Register" option from the main menu
Preconditions 
User is not yet registered; the database is accessible
Postconditions 
Account is stored with "Pending" status, awaiting Admin approval
Main Course 
1. Enter Display Name, @ID, Email, Phone, Password, Security Q&amp;
2. System validates and stores with Pending status.
3. Account is stored in the Users table with "Pending" status.
4. Admin approves account
Alternate Courses 
AC1: User enters existing @ID/Email.
1. System displays "The ID/Email name already exists.”.
2. Users are prompted to re-enter information
Exceptions 
EX1: Invalid input format (e.g., invalid email or phone).
1. System displays an error message and prompts re-entry.
EX2: Database connection failure.
1. System displays errors and terminates the registration process

 

 
1.2 Login description 
Use Case Name 
Login 
Use Case ID 
UC02 
Description 
Allows users to log into the system using their @ID and password
Actor 
Player/ Viewer 
Organizational Benefits 
Allows users to log into the system using their @ID and password
Triggers 
User selects the "Login" option.
Preconditions 
Account exists and is "Approved".
Postconditions 
Users are redirected to the role-based main menu.
Main Course 
1. User enters @ID and password.
2. System validates credentials.
3. If correct, login is successful
Alternate Courses 
AC1: Invalid credentials.
1. System displays "Incorrect @ID or password".
2. Prompt re-entry
Exceptions 
EX1: Database connection failure.
1. Show system error and terminate login

 


1.3 Search tournaments 
Use Case Name 
Search Tournaments 
Use Case ID 
UC03 
Description 
Enables users to search for tournaments by name, game, or date.
Actor 
Player/ Viewer 
Organizational Benefits 
Facilitates easier navigation and event discovery.
Triggers 
User selects "View Tournament List"
Preconditions 
User is logged in.
Postconditions 
Matching tournament list is displayed.
Main Course 
1. User enters search keyword or filters.
2. System returns matching tournaments.
Alternate Courses 
AC1: No filters → Show all tournaments.
Exceptions 
EX1: No tournaments found → System displays "No results found"

 


1.4 View tournament details 
Use Case Name 
View Tournament Details 
Use Case ID 
UC04 
Description 
Allows users to view full details of a selected tournament 
Actor 
Player/ Viewer 
Organizational Benefits 
Provides complete event visibility for informed decisions. 
Triggers 
User selects a tournament from the list. 
Preconditions 
Tournament exists and is accessible. 
Postconditions 
Tournament information is displayed. 
Main Course 
1. User clicks on a tournament  
2. System displays name, game, date, location, registration deadline 
Alternate Courses 
- 
Exceptions 
EX1: Tournament no longer exists → System displays error



1.5 Create registration 
Use Case Name 
Create Registration  
Use Case ID 
UC05 
Description 
Allows a Player to register for a tournament. 
Actor 
Player 
Organizational Benefits 
Enables participation and event tracking. 
Triggers 
Player selects “Register” on a tournament
Preconditions 
Tournament is still open for registration. 
Postconditions 
Registration is saved with "Pending" status. 
 
Main Course 
1. Player selects a tournament.
2. Confirms registration.
3. System saves record to Registrations table
Alternate Courses 
AC1: Already registered→ System shows “You’ve already registered for this tournament”
Exceptions 
EX1: Deadline passed& → Display registration closed. 
EX2: Database error → Show system error

 


 1.6 Donate (Payment) 
Use Case Name 
Donate (Payment) 
Use Case ID 
UC06 
Description 
Viewer donates money to Player through e-wallet. 
Actor 
Viewer 
Organizational Benefits 
Supports monetization and engagement. 
Triggers 
Viewer selects the Player and enters the amount. 
Preconditions 
Viewer has enough balance in the wallet. 
Postconditions 
Transaction is saved and funds are distributed (70% Player, 30% Admin). 
Main Course 
1. Viewer selects Player  
2. Enters amount  
3. System verifies and processes donation 
Alternate Courses 
AC1: Insufficient balance → Show "Insufficient funds" 
Exceptions 
EX1: Database or transaction error → Show error message 



Activity Diagram: 
Admin activity 
1.1 DeleteUser

1.2 AddTournament/Game

1.3 ApproveTournamentRegistration

1.4 ApproveTeam/Member

1.5 PlayerAchievements

1.6 ViewFeedback

1.7 ViewDonationProfit

1.8 ApproveWithdrawal

1.9 ViewVotingResults

Activity Diagram login

Activity Diagram register

Forgot Password

Tournament view

Profile & Logout

Wallet Top-up - Viewer

Wallet Withdrawal - Player

Donation - Viewer

Payment Information Management - Viewer/Player

Transaction Processing - System

















Design Details 
Menu 
1.1 Main Menu

1.2 Login




1.3 Register

1.4 Forgot Password


1.5 About

Admin  
2.1 Menu

2.2 User Management


2.3 Match Management

2.4 Team Management

2.5 Assign Achievements to Player

2.6 Game Management

2.7 View System Statistics


2.8 View Admin Revenue

2.9 View Donation Reports

2.10 View Voting Results


2.11 Feedback Management

2.12 Delete User


Player
3.1 Menu 

3.2 Team Management (Create/Join/Leave)

3.3 Tournament Management

3.4 View Tournament List


3.5 E-Wallet Management (Withdraw)

3.6 Submit Tournament Feedback

3.7 View Personal Achievements


3.8 Update Personal Information

3.9 Change Password

Viewer
 	4.1 Menu Viewer


4.2 View Tournament List

4.3 View Tournament Rankings

4.4 Donate to Player


4.5 Vote (Player/Tournament/Sport)

4.6 E-Wallet Management (Top-up)


4.7 View Personal Information

4.8 Update Personal Information


Code Design (Class Diagram) 
 
Sequence Diagram 
3.1 Account Registration

3.2 Admin Approves Account

3.3 Login

3.4 Forgot Password


3.5 Admin Deletes User

3.6 Viewer Deposits Money into Wallet

3.7  Viewer Donates to Player

3.8 Player Withdraws Money from Donate Wallet

3.9 Player Creates a New Team

3.10 Player Joins a Team

3.11 Player Leaves a Team

3.12 Admin Adds a New Tournament

3.13  Player Submits Tournament Feedback

3.14 Viewer Votes

3.15 Player Registers for a Tournament

Database Design 
Entity Relationship Diagram 



Or 

Database Design Details 



Users 
Column Name 
Data Type 
Constraints 
Description 
UserID 
int 
Primary Key, Auto Increment
Unique identifier for the user
UserName 
varchar(50)
Unique, NOT NULL
User's unique handle (@UserID or @adminName)
PasswordHash
varchar(255)
NOT NULL
Hashed/Encrypted password
Email
varchar(100)
Unique, NOT NULL
User's email address
PhoneNumber
varchar(20)
 
User's phone number
DisplayName
nvarchar(100)
NOT NULL
User's full name
Role
ENUM(...)
NOT NULL
User's role (e.g., Admin, Player, Viewer)
IsActive
tinyint
NOT NULL, Default 1
Active status (1=active, 0=inactive)
CreatedAt
timestamp
NOT NULL 
Timestamp of account creation
 
LastLogin
datetime
NOT NULL 
Timestamp of the last login
SecurityQuestion
varchar(255)


Security question for password recovery
SecurityAnswer
varchar(255)


Hashed/Encrypted security answer




Games
Column Name
Data Type
Constraints
Description
GameID
int
Primary Key, Auto Increment
Unique identifier for the game/discipline
GameName
varchar(100)
Unique, NOT NULL
Name of the game/discipline
Description
text


Detailed description of the game
IsActive
tinyint
NOT NULL, Default 1
Status (1=supported, 0=unsupported)
CreatedAt
timestamp


Timestamp of creation





Tournaments
Column Name
Data Type
Constraints
Description
TournamentID
int
Primary Key, Auto Increment
Unique identifier for the game/discipline
Name
varchar(100)
NOT NULL
Name of the tournament
Description
text


Detailed description of the tournament
GameID
int
Foreign Key to Games(GameID), NOT NULL
ID of the game featured in the tournament
StartDate
datetime
NOT NULL
Start date and time of the tournament
EndDate
datetime


End date and time of the tournament
EntryFee
decimal(18,2)
Default 0
Fee to enter the tournament
PrizePool
decimal(18,2)


Total prize pool amount
MaxTeams
int


Maximum number of teams allowed
MinTeamSize
int
Default 1
Minimum number of members per team
Status
enum(...)
NOT NULL
Status of the tournament (e.g., Upcoming, Ongoing, Finished)
CreatedBy
int
Foreign Key to Users(UserID)
ID of the Admin who created the tournament
CreatedAt
timestamp


Timestamp of creation



TournamentResults
Column Name
Data Type
Constraints
Description
ResultID
int
Primary Key, Auto Increment
Unique identifier for a result entry
TournamentID
int
Foreign Key to Tournaments(TournamentID)
ID of the tournament
PlayerID
int
Foreign Key to Users(UserID)
ID of the player (for individual tournaments)
TeamID
int
Foreign Key to Teams(TeamID)
ID of the team (for team-based tournaments)
Rank
int
NOT NULL
The final rank achieved
PrizeMoney
decimal(18,2)


Prize money awarded for this rank
Notes
text


Additional notes about the result
CreatedAt
timestamp


Timestamp when the result was recorded



Feedback
Column Name
Data Type
Constraints
Description
FeedbackID
int
Primary Key, Auto Increment
Unique identifier for the feedback
UserID
int
Foreign Key to Users(UserID), NOT NULL
ID of the user who submitted the feedback
TournamentID
int
Foreign Key to Tournaments(TournamentID)
ID of the tournament being reviewed
Rating
int


Rating score (e.g., 1-5 stars)
Comment
text


Detailed comment or review
CreatedAt
timestamp



Timestamp when the feedback was submitted

Xuất sang Trang tính





Achievements
Column Name
Data Type
Constraints
Description
AchievementID
int
Primary Key, Auto Increment
Unique identifier for the achievement
UserID
int
Foreign Key to Users(UserID), NOT NULL
ID of the Player who earned the achievement
Title
varchar(200)
NOT NULL
Name of the achievement (e.g., "MVP of Tournament X")
Description
text


Detailed description of the achievement
AchievementDate
timestamp
NOT NULL
Date the achievement was earned
AwardedBy
int
Foreign Key to Users(UserID)
ID of the Admin who granted the achievement
Status
enum(...)


Status (e.g., Awarded, Revoked)



Wallets
Column Name
Data Type
Constraints
Description
WalletID
int
Primary Key, Auto Increment
Unique identifier for the wallet
UserID
int
Foreign Key to Users(UserID), Unique, NOT NULL
ID of the user who owns the wallet
Balance
decimal(18,2)
NOT NULL, Default 0
The current balance in the wallet
LastUpdated
timestamp


Timestamp of the last balance update



WalletHistory
Column Name
Data Type
Constraints
Description
HistoryID
int
Primary Key, Auto Increment
Unique identifier for the transaction record
WalletID
int
Foreign Key to Wallets(WalletID), NOT NULL
ID of the wallet involved in the transaction
Amount
decimal(18,2)
NOT NULL
Transaction amount (can be negative or positive)
Type
enum(...)
NOT NULL
Transaction type (e.g., DEPOSIT, WITHDRAW, DONATE_SENT, DONATE_RECEIVED)
ReferenceID
int


Foreign key to the source record (e.g., DonationID, WithdrawalID)
State
enum(...)


Transaction state (e.g., Pending, Completed, Failed)
CreatedAt
timestamp


Timestamp when the transaction was created
ProcessedAt
datetime


Timestamp when the transaction was processed




Donations
Column Name
Data Type
Constraints
Description
DonationID
int
Primary Key, Auto Increment
Unique identifier for the donation
FromUserID
int
Foreign Key to Users(UserID), NOT NULL
ID of the sender (Viewer)
ToUserID
int
Foreign Key to Users(UserID), NOT NULL
ID of the receiver (Player)
Amount
decimal(18,2)
NOT NULL
The amount of money donated
Message
text


A message included with the donation
DonationDate
timestamp


Timestamp when the donation was made
Status
enum(...)


Status of the donation (e.g., Completed, Refunded)




Withdrawals
Column Name
Data Type
Constraints
Description
WithdrawalID
int
Primary Key, Auto Increment
Unique identifier for the withdrawal request
UserID
int
Foreign Key to Users(UserID), NOT NULL
ID of the user requesting the withdrawal
Amount
decimal(18,2)
NOT NULL
The amount of money requested
BankAccountNumber
varchar(50)
NOT NULL
Recipient's bank account number
BankName
varchar(100)
NOT NULL
Name of the recipient's bank
AccountHolderName
varchar(100)
NOT NULL
Name of the bank account holder
Status
enum(...)
NOT NULL
Status of the request (e.g., Pending, Approved, Rejected)
RequestDate
timestamp


Timestamp when the request was submitted
ProcessedBy
int
Foreign Key to Users(UserID)
ID of the Admin who processed the request
ProcessedDate
datetime


Timestamp when the request was processed
Notes
text


Notes from the Admin regarding the request




Votes
Column Name
Data Type
Constraints
Description
VoteID
int
Primary Key, Auto Increment
Unique identifier for the vote
UserID
int
Foreign Key to Users(UserID), NOT NULL
ID of the user who cast the vote
VoteType
enum(...)
NOT NULL
The category of the vote (e.g., Player, Game, Tournament)
TargetID
int
NOT NULL
ID of the entity being voted for
Rating
int


An optional rating score
CreatedAt
timestamp


Timestamp when the vote was cast


Test 
1.1 SendFeedBack 
Test Case Number 
FB-001
Test Case Name 
 SendFeedback_Success()
Test Case Description 
 Checks if a Player can submit feedback for a tournament they participated in. 
Preconditions 
 Player 25 is logged in and has completed Tournament 1.
Test Case Input 
 playerID: 25, tournamentID: 1, rating: 5, comment: "Great tournament!" 
Test Case Expected Output 
 Success message. A new record is created in the Feedback table. 
Test Case Steps 
 1. Call SendFeedback() method. &lt;br> 2. Verify success message. &lt;br> 3. Query DB to confirm the new feedback record exists.
Default Value Preserving 
 New feedback is available for Admin review.

 

 	1.2 ViewFeedback Admin 
Test Case Number 
 FB-002
Test Case Name 
 ViewFeedback_Admin_Success()
Test Case Description 
 Checks if an Admin can approve a new 'Pending' user account. 
Preconditions 
 Admin is logged in. User @NewUser exists with Status = 'Pending'.
Test Case Input 
 userID: ID of @NewUser, action: "Approve"
Test Case Expected Output 
 Success message. The user's status is updated to Approved in the DB. 
Test Case Steps 
 1. Call ApproveAccount() method. &lt;br> 2. Verify success message. &lt;br> 3. Query DB to confirm status change.
Default Value Preserving 
User is now able to log in.

	2.1 Approve New Account
Test Case Number 
ADM-001
Test Case Name 
ApproveNewAccount_Success()
Test Case Description 
Checks if an Admin can approve a new 'Pending' user account. 
Preconditions 
Admin is logged in. User @NewUser exists with Status = 'Pending'.
Test Case Input 
userID: ID of @NewUser, action: "Approve"
Test Case Expected Output 
Success message. The user's status is updated to Approved in the DB. 
Test Case Steps 
1. Call ApproveAccount() method. &lt;br> 2. Verify success message. &lt;br> 3. Query DB to confirm status change.
Default Value Preserving 
User is now able to log in



	2.2 Approve Registration
Test Case Number 
ADM-002
Test Case Name 
ApproveRegistration_Success()
Test Case Description 
Checks if an Admin can approve a Player's pending tournament registration. 
Preconditions 
Admin is logged in. A registration with Status = 'Pending' exists.
Test Case Input 
registrationID: 12, action: "Approve"
Test Case Expected Output 
Success message. The registration's status is updated to Approved. 
Test Case Steps 
1. Call ApproveRegistration() method. &lt;br> 2. Verify success message. &lt;br> 3. Query DB to confirm status change.
Default Value Preserving 
Player is officially registered for the tournament

	2.3 Approve Team
Test Case Number 
ADM-003
Test Case Name 
ApproveTeam_Success()
Test Case Description 
Checks if an Admin can approve a new 'Pending' team. 
Preconditions 
Admin is logged in. A team with Status = 'Pending' exists.
Test Case Input 
teamID: 5, action: "Approve"
Test Case Expected Output 
Success message. The team's status is updated to Approved.
Test Case Steps 
1. Call ApproveTeam() method. &lt;br> 2. Verify success message. &lt;br> 3. Query DB to confirm status change.
Default Value Preserving 
The team is now active.





	2.3  Change Approve Role
Test Case Number 
ADM-004
Test Case Name 
ApproveRoleChange_Success()
Test Case Description 
Checks if an Admin can approve a user's role change request. 
Preconditions 
Admin is logged in. A RoleChangeRequest with Status = 'Pending' exists for a Player wanting to be a Viewer.
Test Case Input 
requestID: 3, action: "Approve"
Test Case Expected Output 
Success message. The request status is updated to Approved. The user's Role in the Users table is updated to 'Viewer'. 
Test Case Steps 
1. Call ApproveRoleChange() method. &lt;br> 2. Verify success message. &lt;br> 3. Query DB to confirm the user's new role.
Default Value Preserving 
User's role has been changed.

	2.4 Approve Withdrawal
Test Case Number 
ADM-005
Test Case Name 
ApproveWithdrawal_Success()
Test Case Description 
Checks if an Admin can approve a Player's withdrawal request. 
Preconditions 
Admin is logged in. A Withdrawal request with Status = 'Pending' exists. Player has sufficient funds.
Test Case Input 
withdrawalID: 7, action: "Approve"
Test Case Expected Output 
Success message. Request status becomes Approved. Player's wallet balance is reduced. 
Test Case Steps 
1. Call ApproveWithdrawal() method. &lt;br> 2. Verify success message. &lt;br> 3. Query DB to confirm status change and new balance.
Default Value Preserving 
Withdrawal is processed.





 	2.6 Add Tournament Result 
Test Case Number 
ADM-006
Test Case Name 
AddTournamentResult_Success()
Test Case Description 
Checks if an Admin can add results for a completed tournament. 
Preconditions 
Admin is logged in. Tournament 1 is complete.
Test Case Input 
tournamentID: 1, playerID: 25, rank: 1, prizeMoney: 1000
Test Case Expected Output 
Success message. A new record is created in the TournamentResults table. 
Test Case Steps 
1. Call AddResult() method. &lt;br> 2. Verify success message. &lt;br> 3. Query DB to confirm new result record.
Default Value Preserving 
Tournament results are recorded and viewable.

	2.7 Assign Achievement
Test Case Number 
ADM-007
Test Case Name 
AssignAchievement_Success()
Test Case Description 
Checks if an Admin can grant a custom achievement to a Player. 
Preconditions 
Admin is logged in. Player 25 exists.
Test Case Input 
playerID: 25, title: "Tournament MVP", description: "Most Valuable Player of Summer Skirmish"
Test Case Expected Output 
Success message. A new record is created in the Achievements table for the player. 
Test Case Steps 
1. Call AssignAchievement() method. &lt;br> 2. Verify success message. &lt;br> 3. Query DB to confirm new achievement.
Default Value Preserving 
Player has a new achievement on their profile.





	2.8 Create Tournament
Test Case Number 
ADM-008
Test Case Name 
CreateTournament_Success()
Test Case Description 
Checks if an Admin can successfully create a new tournament. 
Preconditions 
Admin is logged in.
Test Case Input 
Name: "Winter Championship", GameID: 2, StartDate: "2025-12-01"
Test Case Expected Output 
Success message. A new record is created in the Tournaments table. 
Test Case Steps 
1. Call CreateTournament() method. &lt;br> 2. Verify success message. &lt;br> 3. Query DB to confirm new tournament.
Default Value Preserving 
A new tournament is created in the system.

	2.9 Update Touranment Info
Test Case Number 
ADM-009
Test Case Name 
UpdateTournamentInfo_Success()
Test Case Description 
Checks if an Admin can update the details of an existing tournament. 
Preconditions 
Admin is logged in. Tournament 1 exists.
Test Case Input 
tournamentID: 1, newPrizePool: 7500
Test Case Expected Output 
Success message. The PrizePool for tournament 1 is updated in the DB.
Test Case Steps 
1. Call UpdateTournament() method. &lt;br> 2. Verify success message. &lt;br> 3. Query DB to confirm the update.
Default Value Preserving 
Tournament details are updated.



	2.10 Delete Tournament
Test Case Number 
ADM-010
Test Case Name 
DeleteTournament_Success()
Test Case Description 
Checks if an Admin can delete a tournament. 
Preconditions 
Admin is logged in. Tournament 9 exists and has no critical dependencies preventing deletion.
Test Case Input 
tournamentID: 9
Test Case Expected Output 
Success message. The record for tournament 9 and its related data (registrations, results) are deleted.
Test Case Steps 
1. Call DeleteTournament() method. &lt;br> 2. Verify success message. &lt;br> 3. Query DB to confirm the tournament is gone.
Default Value Preserving 
The tournament is removed from the system.

	2.11 Delete User
Test Case Number 
ADM-011
Test Case Name 
DeleteUser_Success()
Test Case Description 
Checks if an Admin can delete a user account and all their related data. 
Preconditions 
Admin is logged in. User 50 exists.
Test Case Input 
userID: 50
Test Case Expected Output 
Success message. The record for user 50 and all their related records (donations, votes, feedback, etc.) are deleted. 
Test Case Steps 
1. Call DeleteUser() method. &lt;br> 2. Verify success message. &lt;br> 3. Query Users and other tables to confirm deletion.
Default Value Preserving 
The user is completely removed from the system.



	2.12 View System Statistics
Test Case Number 
ADM-012
Test Case Name 
ViewSystemStatistics_Success()
Test Case Description 
Checks if an Admin can view system-wide statistics, such as profit from donations. 
Preconditions 
Admin is logged in. There are donation records in the database.
Test Case Input 
N/A
Test Case Expected Output 
A summary of statistics is displayed, including total profit calculated from the Donations table. 
Test Case Steps 
1. Call ViewStatistics() method. &lt;br> 2. Verify that the displayed data is a correct summary of the database state.
Default Value Preserving 
Admin has reviewed system statistics.

Login Test
	1.1 Login test 1
Test Case Number 
ACC-001
Test Case Name 
Login_Success()
Test Case Description 
This test case checks if a valid, existing user can log in successfully.
Preconditions 
User with username @Player01 and password password123 exists and is Approved.
Test Case Input 
username: "@Player01", password: "password123"
Test Case Expected Output 
Login is successful. The system returns the User object with Role = 'Player'. The Player main menu is displayed.
Test Case Steps 
1. Instantiate UserBL.&lt;br>2. Call Login() method with input.&lt;br>3. Compare the returned User object's role with the expected output.&lt;br>4. Verify the correct menu is shown.
Default Value Preserving 
User's LastLogin timestamp is updated in the database.



1.2 Login test 2
Test Case Number 
ACC-002
Test Case Name 
Login_Failure_IncorrectPassword()
Test Case Description 
This test case checks if the system prevents login with an incorrect password.
Preconditions 
User with username @Player01 exists.
Test Case Input 
username: "@Player01", password: "wrongpassword"
Test Case Expected Output 
Login fails. An error message like "Invalid username or password" is returned.
Test Case Steps 
Login fails. An error message like "Invalid username or password" is returned.
Default Value Preserving 
No changes in the database. The user is not logged in.


Register Account test
	2.1 Register test 1
Test Case Number 
ACC-003
Test Case Name 
Register_Success_NewUser()
Test Case Description 
This test case checks if a new user can register with valid and unique information.
Preconditions 
The username @NewUser and email new@user.com do not exist in the database.
Test Case Input 
username: "@NewUser", email: "new@user.com", password: "securepass", etc.
Test Case Expected Output 
A success message ("Registration successful, awaiting approval.") is displayed. A new record is created in the Users table with Status = 'Pending'.
Test Case Steps 
1. Call Register() method with input.&lt;br>2. Verify the success message.&lt;br>3. Query the database to confirm the new user exists with the correct status.
Default Value Preserving 
A new user record exists in the database.



  2.2 Register test 2
Test Case Number 
ACC-004
Test Case Name 
Register_Success_NewUser()
Test Case Description 
This test case checks if the system prevents registration with a username that already exists.
Preconditions 
A user with username @Player01 already exists in the database.
Test Case Input 
username: "@Player01",&lt;br>email: "new.email@example.com",&lt;br>password: "password123"
Test Case Expected Output 
An error message is returned, e.g., "Username already exists." No new user is created.
Test Case Steps 
1. Call Register() method with the specified input.&lt;br>2. Verify that the system returns an error.&lt;br>3. Query the database to confirm that no new user record was created.
Default Value Preserving 
The Users table remains unchanged.


2.3 Register test 3
Test Case Number 
ACC-005
Test Case Name 
Register_Failure_DuplicateEmail()
Test Case Description 
This test case checks if the system prevents registration with an email that already exists.
Preconditions 
A user with email player01@example.com already exists in the database.
Test Case Input 
username: "@NewPlayer99",&lt;br>email: "player01@example.com",&lt;br>password: "password123"
Test Case Expected Output 
An error message is returned, e.g., "Email already exists." No new user is created.
Test Case Steps 
1. Call Register() method with the specified input.&lt;br>2. Verify that the system returns an error.&lt;br>3. Query the database to confirm that no new user record was created.
Default Value Preserving 
The Users table remains unchanged.



2.4 Register test 4
Test Case Number 
ACC-006
Test Case Name 
Register_Failure_InvalidPassword()
Test Case Description 
This test case checks if the system rejects a password that is too short or weak.
Preconditions 
System rules require a password to be at least 8 characters long.
Test Case Input 
username: "@NewPlayer99",&lt;br>email: "new99@example.com",&lt;br>password: "123"
Test Case Expected Output 
An error message is returned, e.g., "Password must be at least 8 characters long."
Test Case Steps 
1. Call Register() method with the specified input.&lt;br>2. Verify that the system returns the correct validation error.
Default Value Preserving 
No user account is created.


Search & View Information
	3.1 SearchTournament
Test Case Number 
VIEW-001
Test Case Name 
SearchTournament_Found()
Test Case Description 
Checks if a user can find a tournament by searching for a keyword in its name.
Preconditions 
A tournament named "Summer Championship" exists.
Test Case Input 
keyword: "Summer"
Test Case Expected Output 
A list containing the "Summer Championship" tournament is displayed. 
Test Case Steps 
A list containing the "Summer Championship" tournament is displayed. 
Default Value Preserving 
Search results are displayed to the user.



	3.2 ViewTournamentDetails
Test Case Number 
VIEW-002
Test Case Name 
ViewTournamentDetails_Success()
Test Case Description 
Checks if the full details of a specific tournament can be viewed. 
Preconditions 
A tournament with TournamentID=1 exists.
Test Case Input 
tournamentID: 1
Test Case Expected Output 
All details (name, game, date, prize pool, etc.) of tournament 1 are displayed. 
Test Case Steps 
1. Call GetTournamentDetails() method. &lt;br> 2. Verify that the displayed details match the data in the database. 
Default Value Preserving 
User has viewed the tournament details.


3.3 SearchPlayer	
Test Case Number 
VIEW-003
Test Case Name 
SearchPlayer_Found()
Test Case Description 
Checks if a user can find a player by searching for their name.
Preconditions 
A player with DisplayName = “John Doe”exists
Test Case Input 
keyword: "John"
Test Case Expected Output 
A list containing the player "John Doe" is displayed.
Test Case Steps 
1. Call SearchPlayer() method. &lt;br> 2. Verify the returned list contains the expected player.
Default Value Preserving 
Search results are displayed to the user.



	3.4 ViewPlayerProfile
Test Case Number 
VIEW-004
Test Case Name 
ViewPlayerProfile_Success()
Test Case Description 
Checks if a user can view the full profile of a specific player, including stats and achievements. 
Preconditions 
A player with UserID=25 exists.
Test Case Input 
userID: 25
Test Case Expected Output 
The profile for user 25 is displayed, including their name, achievements, and tournament history. 
Test Case Steps 
1. Call ViewPlayerProfile() method. &lt;br> 2. Verify that the displayed information is correct.
Default Value Preserving 
User has viewed the player's profile.

	3.5 ViewTeamInfo
Test Case Number 
VIEW-005
Test Case Name 
ViewTeamInfo_Success()
Test Case Description 
Checks if a user can view the information of a specific team, including its members. 
Preconditions 
A team with TeamID=5 exists and has members.
Test Case Input 
teamID: 5
Test Case Expected Output 
The details for team 5 are displayed, including team name, leader, and a list of members. 
Test Case Steps 
1. Call ViewTeamInfo() method. &lt;br> 2. Verify the displayed team information is correct.
Default Value Preserving 
User has viewed the team's information.




Tournament & Achievements
	4.1 View Match Schedule
Test Case Number 
VIEW-006
Test Case Name 
ViewMatchSchedule_Success()
Test Case Description 
Checks if a user can view the match schedule for a tournament.
Preconditions 
A tournament with TournamentID=1 exists and has a schedule.
Test Case Input 
tournamentID: 1
Test Case Expected Output 
A list of matches with players/teams and times is displayed.
Test Case Steps 
1. Call ViewMatchSchedule() method. &lt;br> 2. Verify the schedule is displayed.
Default Value Preserving 
User is informed of the match schedule.

	4.2 View Match Schedule
Test Case Number 
VIEW-007
Test Case Name 
ViewMatchSchedule_Success()
Test Case Description 
Checks if a user can view the match schedule for a tournament.
Preconditions 
A tournament with TournamentID=1 exists and has a schedule.
Test Case Input 
tournamentID: 1
Test Case Expected Output 
A list of matches with players/teams and times is displayed.
Test Case Steps 
1. Call ViewMatchSchedule() method. &lt;br> 2. Verify the schedule is displayed.
Default Value Preserving 
User is informed of the match schedule.



	4.3 View Tournament Ranking
Test Case Number 
VIEW-008
Test Case Name 
ViewTournamentRanking_Success()
Test Case Description 
Checks if a user can view the final ranking for a completed tournament. 
Preconditions 
Tournament 1 is completed and results have been entered.
Test Case Input 
tournamentID: 1
Test Case Expected Output 
A ranked list of players/teams for tournament 1 is displayed. 
Test Case Steps 
1. Call ViewTournamentRanking() method. &lt;br> 2. Verify the list is correctly ranked.
Default Value Preserving 
User has viewed the tournament ranking.


3. Registration & Participation
	5.1 Create Registration
Test Case Number 
REG-001
Test Case Name 
CreateRegistration_Success()
Test Case Description 
Checks if a Player can successfully register for an open tournament. 
Preconditions 
Player is logged in. Tournament (ID=5) is open for registration. Player is not already registered. 
Test Case Input 
playerID: 25, tournamentID: 5
Test Case Expected Output 
Success message. A new record is created in the Registrations table with Status = 'Pending'. 
Test Case Steps 
1. Call CreateRegistration() method. &lt;br> 2. Verify success message. &lt;br> 3. Query Registrations table to confirm.
Postconditions
Player has a pending registration for the tournament.



	5.2 Cancel Registration
Test Case Number 
REG-002
Test Case Name 
CancelRegistration_Success()
Test Case Description 
Checks if a Player can cancel their existing tournament registration.
Preconditions 
Player 25 has a registration (RegistrationID=12) for a tournament that has not yet started.
Test Case Input 
registrationID: 12
Test Case Expected Output 
The system displays the status "Approved".
Test Case Steps 
1. Call CancelRegistration() method. &lt;br> 2. Verify success message. &lt;br> 3. Query DB to confirm the registration is gone or its status has changed..
Postconditions
User is informed of their registration status.

	5.3 View Registration Status
Test Case Number 
REG-003
Test Case Name 
ViewRegistrationStatus_Success()
Test Case Description 
Checks if a Player can view the status of their registration. 
Preconditions 
Player 25 has a registration (RegistrationID=12) with status 'Approved'.
Test Case Input 
playerID: 25, tournamentID: 5
Test Case Expected Output 
Success message. A new record is created in the Registrations table with Status = 'Pending'. 
Test Case Steps 
1. Call CreateRegistration() method. &lt;br> 2. Verify success message. &lt;br> 3. Query Registrations table to confirm.
Postconditions
Player has a pending registration for the tournament.



Participation
6.1 Create Team
Test Case Number 
TEAM-001
Test Case Name 
CreateTeam_Success()
Test Case Description 
Checks if a Player can create a new team. The creator becomes the leade
Preconditions 
Player 25 is logged in. The team name "New Legends" is unique.
Test Case Input 
teamName: "New Legends", description: "A new team"
Test Case Expected Output 
Success message. A new record is created in the Teams table with Status = 'Pending'. 
Test Case Steps 
1. Call CreateTeam() method. &lt;br> 2. Verify success message. &lt;br> 3. Query DB to confirm new team exists.
Postconditions
A new team awaits Admin approval.


	6.2 Join Team
Test Case Number 
TEAM-002
Test Case Name 
JoinTeam_Success()
Test Case Description 
Checks if a Player can send a request to join an existing team. 
Preconditions 
Player 26 is logged in. Team 5 ("Titans") exists and is approved. Player 26 is not a member.
Test Case Input 
playerID: 26, teamID: 5
Test Case Expected Output 
Success message. A new record is created in the TeamMembers table with Status = 'Pending'. 
Test Case Steps 
1. Call JoinTeam() method. &lt;br> 2. Verify success message. &lt;br> 3. Query DB to confirm the pending member request.
Postconditions
A request to join the team awaits approval.



	6.3 Leave Team
Test Case Number 
TEAM-003
Test Case Name 
LeaveTeam_Success_Member()
Test Case Description 
Checks if a regular member can leave a team. 
Preconditions 
Player 26 is a member of Team 5. Player 26 is not the team leader.
Test Case Input 
playerID: 26, teamID: 5
Test Case Expected Output 
Success message. The record for Player 26 in the TeamMembers table for Team 5 is deleted.
Test Case Steps 
1. Call LeaveTeam() method. &lt;br> 2. Verify success message. &lt;br> 3. Query DB to confirm the player is no longer a member.
Postconditions
The player is removed from the team.


7. Donate
	7.1 View Wallet Balance
Test Case Number 
WLT-001
Test Case Name 
ViewWalletBalance_Success()
Test Case Description 
Checks if a user can view their current wallet balance.  
Preconditions 
User 10 is logged in. Their wallet balance is 200.
Test Case Input 
userID: 10
Test Case Expected Output 
The system displays the balance "200".
Test Case Steps 
1. Call ViewWalletBalance() method. &lt;br> 2. Verify the displayed balance is correct.
Postconditions
User is informed of their wallet balance.



	7.2 Deposit Money
Test Case Number 
WLT-002
Test Case Name 
DepositMoney_Success()
Test Case Description 
Checks if a Viewer can successfully deposit money into their wallet. 
Preconditions 
Viewer 10 is logged in. Their initial balance is 200.
Test Case Input 
userID: 10, amount: 100
Test Case Expected Output 
Success message. The user's wallet balance in the Wallets table is updated to 300. 
Test Case Steps 
1. Call DepositMoney() method. &lt;br> 2. Verify success message. &lt;br> 3. Call ViewWalletBalance() to confirm the new balance.
Postconditions
User's wallet balance is increased.


	7.3 Withdraw Money
Test Case Number 
WLT-003
Test Case Name 
WithdrawMoney_Request_Success()
Test Case Description 
Checks if a Player can successfully submit a withdrawal request.  
Preconditions 
Player 25 is logged in with a balance of >= 500.
Test Case Input 
userID: 25, amount: 500, bankInfo: {...}
Test Case Expected Output 
Success message. A new record is created in Withdrawals with Status = 'Pending'.  
Test Case Steps 
1. Call RequestWithdrawal() method. &lt;br> 2. Verify success message. &lt;br> 3. Query DB to confirm the pending withdrawal request.
Postconditions
A withdrawal request awaits Admin approval.



	7.4 Donete To Player
Test Case Number 
WLT-004
Test Case Name 
DonateToPlayer_Success()
Test Case Description 
Checks a successful donation from a Viewer to a Player.  
Preconditions 
Viewer 10 has a balance of >= 100. Player 25 exists.
Test Case Input 
fromUserID: 10, toUserID: 25, amount: 100
Test Case Expected Output 
Success message. Viewer's balance decreases by 100. Player's balance increases by 70. A record is created in Donations. 
Test Case Steps 
1. Call ProcessDonation() method. &lt;br> 2. Verify success message. &lt;br> 3. Query DB to check final balances and new records.
Postconditions
Balances are updated, transaction is logged.


	7.5 View Donation History
Test Case Number 
WLT-005
Test Case Name 
ViewDonationHistory_Success()
Test Case Description 
Checks if a user can view their donation history (sent or received).  
Preconditions 
User 10 has made or received donations.
Test Case Input 
userID: 10
Test Case Expected Output 
A list of donation records involving User 10 is displayed.
Test Case Steps 
1. Call ViewDonationHistory() method. &lt;br> 2. Verify the displayed list is correct.records.
Postconditions
User has viewed their donation history.



Task Assignment (To Each Group Member) 
Group Name 
Project Name 
No 
Task name 
Description 
Start Date 
End Date 
Member 
Self- Assessment 
1 
Write reports
 
07/05
07/06
Quan
 
2 
Code
 
 
20/06
Quan, D. Dat
 
3 
Control
 
 
 
Quan, D. Dat
 
4 
Draw diagram
 
 
20/6
H.Dat, Minh
 
5 


 
 
 


 

 
 
Installation Instructions 
Deployment Diagram 


Installation Steps 
Install Database 
Install Server 
Install Application 

