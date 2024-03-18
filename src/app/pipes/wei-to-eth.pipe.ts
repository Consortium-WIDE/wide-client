import { Pipe, PipeTransform } from '@angular/core';
import { BigNumber } from 'bignumber.js';

@Pipe({
  name: 'weiToEth',
  standalone: true,
})
export class WeiToEthPipe implements PipeTransform {

  transform(value: any, decimals: number = 18): string {
    if (!value) return '0';
    try {
      // Convert the input value to a BigNumber to handle large numbers safely
      const wei = new BigNumber(value);
      // Convert WEI to ETH by dividing by 10^decimals
      const eth = wei.dividedBy(new BigNumber(10).pow(decimals));
      return eth.toFixed();
    } catch (error) {
      console.warn('Error converting WEI to ETH:', error);
      return 'Invalid input';
    }
  }
}
