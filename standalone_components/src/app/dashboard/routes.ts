import { Route } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { TodayComponent } from "./today/today.component";


export const Dashboard_Routes : Route[] = [
    {
        path:'',
        component:DashboardComponent
    },
    {
        path:'today',
        component:TodayComponent
    }

]