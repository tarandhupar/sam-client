import {AlertType} from "../../api-kit/system-alerts/system-alerts.service";

export const error: AlertType = {
  content: {
    "title" : "The is an error",
    "category" : "outages",
    "description" : "This is the description",
    "severity" : "ERROR",
    "begins" : "2016-11-01T20:03:09Z",
    "expires" : "2016-11-01T20:03:09Z",
    "published" : "2016-11-01T20:03:09Z"
  }
};

export const warning = {
  content: {
    "title": "The is an warning",
    "category": "outages",
    "description": "This is the description",
    "severity": "WARNING",
    "begins": "2016-11-01T20:03:09Z",
    "expires": "2016-11-01T20:03:09Z",
    "published": "2016-11-01T20:03:09Z"
  }
};

export const info = {
  content: {
    "title": "The is information",
    "category": "features",
    "description": "This is the description",
    "severity": "INFORMATIONAL",
    "begins": "2016-11-01T20:03:09Z",
    "expires": "2016-11-01T20:03:09Z",
    "published": "2016-11-01T20:03:09Z"
  }
};
