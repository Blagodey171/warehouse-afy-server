CREATE TABLE users (
    Id smallserial PRIMARY KEY,
    Login varchar UNIQUE,
    Password varchar,
    DateCreate date
);

CREATE TABLE devices (
    DeviceId smallserial,
    AccessToken  varchar,
    RefreshToken varchar,
    DateCreate date,
    IsAuthorisation boolean,
    DeviceUser integer,
    FOREIGN KEY (deviceUser) REFERENCES users (Id)
);