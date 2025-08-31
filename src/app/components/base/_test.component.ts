import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-appbar',
  template: `

    <app-row>
      <app-button label="Filled" variant="filled" [disabled]="true" (clicked)="do()">
      </app-button>
      
      <app-button label="Filled icona" iconLeft="home.svg" variant="filled" (clicked)="do()">
      </app-button>
  
      <app-button iconLeft="home.svg" variant="filled" (clicked)="do()">
      </app-button>

      <app-button iconLeft="home.svg" variant="filled" shape='round' (clicked)="do()">
      </app-button>
    </app-row>


    <app-row>
      <app-button label="Outlined" variant="outlined" (clicked)="do()">
      </app-button>
  
      <app-button label="Outlined icona" iconLeft="home.svg" variant="outlined" (clicked)="do()">
      </app-button>
  
      <app-button iconLeft="home.svg" variant="outlined" (clicked)="do()">
      </app-button>
    </app-row>

    <app-row>
      <app-button label="Text" variant="text" (clicked)="do()">
      </app-button>
  
      <app-button label="Text icona" iconLeft="home.svg" variant="text" (clicked)="do()">
      </app-button>
  
      <app-button iconLeft="home.svg" variant="text" (clicked)="do()">
      </app-button>
    </app-row>

    <app-row>
      <app-button label="Filled" variant="filled" type="error" (clicked)="do()">
      </app-button>
      
      <app-button label="Filled icona" iconLeft="home.svg" variant="filled" type="warning" (clicked)="do()">
      </app-button>
  
      <app-button iconLeft="home.svg" variant="filled" type="error" (clicked)="do()">
      </app-button>
    </app-row>

    <app-row>
      <app-button label="Filled" variant="outlined" type="error" (clicked)="do()">
      </app-button>
      
      <app-button label="Filled icona" iconLeft="home.svg" variant="outlined" type="error" (clicked)="do()">
      </app-button>
  
      <app-button iconLeft="home.svg" variant="outlined" type="warning" (clicked)="do()">
      </app-button>
    </app-row>

    <app-row>
      <app-button label="Filled" variant="text" type="error" (clicked)="do()">
      </app-button>
      
      <app-button label="Filled icona" iconLeft="home.svg" variant="text" type="error" (clicked)="do()">
      </app-button>
  
      <app-button iconLeft="home.svg" variant="text" type="error" (clicked)="do()">
      </app-button>
    </app-row>


    <br/>
    <br/>
    primeng
    <br/>

    <p-button (click)="do()" [outlined]="true" [disabled]="true">
      Start here to add new Categories
    </p-button>

    <p-button label="Normal" icon="pi pi-check" />
        <p-button icon="pi pi-check" />
    <p-button icon="pi pi-check" [rounded]="true" />

  `,
  styles: [`
    
  `]  
})
export class TestComponent {

  do() {}
}
