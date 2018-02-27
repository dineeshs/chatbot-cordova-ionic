import { Pipe, PipeTransform } from '@angular/core';
import { Constants } from './constants';


@Pipe({
  name: 'translate'
})
export class Translate implements PipeTransform {
  transform(value: string, language): string {
      console.log(value);
      if(language === "spanish") {
          
        if(value ==="help") {
            return "Ayuda";
        }
        if(value === "quantityField") {
            return "Cantidad";
        }
        if(value === "printField") {
            return "Impresión";
        }
        if(value === "Hammer") {
            return 'Martillo';
        }
        if(value === "10 lb Sledge Hammer with 34 inch Fiberglass Handle") {
            return "Martillo de trineo de 10 lb con manija de fibra de vidrio de 34";        }

        if(value === "selectLanguage") {
            return "Seleccione el idioma"
        }

        if (value === "spanish") {
            return "Español"
        }

        if (value === "english") {
            return "Inglés"
        }

        if(value === "Change OnHands Value") {
            return "Cambiar el valor de OnHands";
        }
        if(value === "Change Location Value") {
            return "Cambiar el valor de ubicación";
        }

        if(value === "Actions Available:") {
            return "Acciones disponibles:";
        }
          
      }
      else {
          if(value === "help") {
            return "Help";
          }

          if(value === "quantityField") {
            return "Quantity";
        }
        if(value === "printField") {
            return "Print";
        }
        if(value === "Hammer") {
            return 'Hammer';
        }

        if(value === "10 lb Sledge Hammer with 34 inch Fiberglass Handle") {
            return value;       
          
      }

      if(value === "selectLanguage") {
        return "Select Language"
    }

    if (value === "english") {
        return "English"
    }
    if (value === "spanish") {
        return "Spanish"
    }

    if(value === "Change OnHands Value") {
        return value;
    }
    if(value === "Change Location Value") {
        return value;
    }

    if(value === "Actions Available:") {
        return value;
    }
          
      }
  }
}