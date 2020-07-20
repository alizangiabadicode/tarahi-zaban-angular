import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tarahi-zaban';
  categories = [];
  category
  products: any;
  constructor(private http: HttpClient, public dialog: MatDialog, public auth: AuthService) {
    this.getCetagories();
  }

  getCetagories() {
    this.http.get("http://localhost:5000/categories")
      .subscribe(
        (n: []) => {
          console.log(n);
          this.categories = n;
          this.getProducts();
        }
      )
  }

  getProducts(categoryId = this.categories[0][0]) {
    this.http.get("http://localhost:5000/getProducts?categoryId=" + categoryId)
      .subscribe(
        n => {
          console.log(n);
          this.products = n;
        }
      )
  }

  getDetail(productId) {
    this.http.get("http://localhost:5000/productDetail?productId=" + productId)
      .subscribe(
        (n: any) => {
          console.log(n);
          const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
            data: n.data
          });

          dialogRef.afterClosed().subscribe(result => {
          });
        }
      )

  }

  openCardItems() {
    const email = this.auth.email;
    this.http.get("http://localhost:5000/getCardItems?email=" + email)
      .subscribe(
        (n: any) => {
          console.log(n);
          const dialogRef = this.dialog.open(DialogOverviewExampleDialogDetail, {
            data: n
          });

          dialogRef.afterClosed().subscribe(result => {
          });
        }
      )
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  styleUrls: ['dialog-overview-example-dialog.scss'],
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data, private snackBar: MatSnackBar, private http: HttpClient) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addToCard(productId) {
    if (!!!localStorage.getItem("login")) {
      this.snackBar.open("لطفا اول وارد شوید!", "بستن", {
        direction: 'rtl'
      })
    }
    else {
      this.http.get("http://localhost:5000/addProductToCard?productId=" + productId + "&email=" + localStorage.getItem("login"))
        .subscribe(
          n => {
            this.snackBar.open("با موفقیت به سبد خرید اضافه شد!", "بستن", {
              direction: 'rtl'
            })
          }
        )
    }
  }

}


@Component({
  selector: 'dialog-overview-example-dialog-datail',
  styleUrls: ['dialog-overview-example-dialog-detail.scss'],
  templateUrl: 'dialog-overview-example-dialog-detail.html',
})
export class DialogOverviewExampleDialogDetail {

  constructor(private auth: AuthService,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialogDetail>,
    @Inject(  MAT_DIALOG_DATA) public data, private snackBar: MatSnackBar, private http: HttpClient) {
    console.log('data.products', data.products)
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  removeFromCard(productId) {
    if (!!!localStorage.getItem("login")) {
      this.snackBar.open("لطفا اول وارد شوید!", "بستن", {
        direction: 'rtl'
      })
    }
    else {
      this.http.get("http://localhost:5000/removeFromCard?productId=" + productId + "&email=" + localStorage.getItem("login"))
        .subscribe(
          n => {
            this.snackBar.open("با موفقیت از سبد خرید حذف شد!", "بستن", {
              direction: 'rtl',
            });

            const email = this.auth.email;
            this.http.get("http://localhost:5000/getCardItems?email=" + email)
              .subscribe(
                (n: any) => {
                  this.data = n;
                }
              )
          })
    }
  }
}
