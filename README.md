# Train-Scheduler

Train schedule application that incorporates Firebase to host arrival and departure data. The app will retrieve and manipulate this information with Moment.js. This website will provide up-to-date information about various trains, namely their arrival times and how many minutes remain until they arrive at their station.

basic specs:

When adding trains, administrators are able to submit the following:
Train Name
Destination 
First Train Time -- in military time
Frequency -- in minutes

Use moments.js to calculate when the next train will arrive - relative to the current time.
Users from many different machines are able to view same train times.

Update "minutes to arrival" and "next train time" text once every minute. 

Edit and remove buttons for each train. Let the user edit the row's elements-- allow them to change a train's Name, Destination and Arrival Time (and then, by relation, minutes to arrival).



