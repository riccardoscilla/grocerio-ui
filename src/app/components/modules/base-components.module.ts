import { NgModule } from '@angular/core';

import { SvgComponent } from '../base/svg.componenet';
import { GifComponent } from '../base/gif.componenet';
import { FixedComponent } from '../base/fixed.component';
import { FixedBottomComponent } from '../app/fixed-bottom.component';
import { FixedBottomRightComponent } from '../app/fixed-bottom-right.component';
import { RowComponent } from '../base/row.component';
import { ContainerComponent } from '../base/container.component';
import { ListComponent } from '../base/list.component';
import { TitleComponent } from '../app/title.component';
import { AppBarComponent } from '../base/appbar.component';
import { ListLoadingComponent } from '../app/list-loading.component';
import { RoundTopContainerComponent } from '../app/round-top-container.component';
import { TimerComponent } from '../base/timer.component';
import { ScaffoldComponent } from '../base/scaffold.component';
import { ChipComponent } from '../base/chip.component';
import { BottomSheetComponent } from '../base/bottom-sheet.component';
import { ListTileComponent } from '../base/list-tile.component';
import { TestComponent } from '../base/_test.component';
import { ButtonComponent } from '../base/button.component';

export const BaseComponentsModule = [
    ButtonComponent,
    
    SvgComponent,
    GifComponent,
    FixedComponent,
    FixedBottomComponent,
    FixedBottomRightComponent,

    ContainerComponent,
    RowComponent,

    ListComponent,
    ListTileComponent,

    TitleComponent,
    RoundTopContainerComponent,
    AppBarComponent,
    ListLoadingComponent,
    BottomSheetComponent,
    TimerComponent,
    ScaffoldComponent,
    ChipComponent,

    TestComponent
];
