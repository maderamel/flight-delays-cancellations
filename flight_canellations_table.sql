DROP TABLE "airline_delay_cause";


CREATE TABLE "airline_delay_cause" (
	"year" INT not null, 
	"month" INT not null,
	"carrier" VARCHAR(5) not null,
	"carrier_name" VARCHAR(30) not null,
	"airport" VARCHAR(5) not null,
	"airport_name" VARCHAR(100) not null,
	"arr_flights" VARCHAR(30),
	"arr_del15" float,
	"carrier_ct" float,
	"weather_ct" float,
	"nas_ct" float,
	"security_ct" float,
	"late_aircraft" float,
	"arr_cancelled" float,
	"arr_diverted" float,
	"arr_delayed" float,
	"carrier_delay" float,
	"weather_delay" float,
	"nas_delay" float,
	"security_delay" float,
	"late_aircraft_delay" float
);	

SELECT * FROM airline_delay_cause