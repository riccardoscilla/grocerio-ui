import { NgModule } from '@angular/core';

import { SvgComponent } from '../base/svg.componenet';
import { GifComponent } from '../base/gif.componenet';
import { FixedComponent } from '../base/fixed.component';
import { FixedBottomComponent } from '../app/fixed-bottom.component';
import { FixedBottomRightComponent } from '../app/fixed-bottom-right.component';
import { RowComponent } from '../base/row.component';
import { ContainerComponent } from '../base/container.component';
import { ListComponent } from '../base/list.component';
import { ListItemComponent } from '../app/list-item.component';
import { TitleComponent } from '../app/title.component';
import { AppBarComponent } from '../base/appbar.component';
import { ListLoadingComponent } from '../app/list-loading.component';
import { RoundTopContainerComponent } from '../app/round-top-container.component';
import { BottomSheetComponent } from '../base/bottom-sheet.component';
import { TimerComponent } from '../base/timer.component';

export const BaseComponentsModule =[
    SvgComponent,
    GifComponent,
    FixedComponent,
    FixedBottomComponent,
    FixedBottomRightComponent,

    ContainerComponent,
    RowComponent,

    ListComponent,
    ListItemComponent,

    TitleComponent,
    RoundTopContainerComponent,
    AppBarComponent,
    ListLoadingComponent,
    BottomSheetComponent,
    TimerComponent
];
