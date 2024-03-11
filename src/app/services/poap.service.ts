import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PoapService {

  private xDAIProvider = new ethers.providers.JsonRpcProvider('https://rpc.coinsdo.net/xdai');
  //private mainnetProvider = new ethers.providers.JsonRpcProvider('https://rpc.coinsdo.net/eth');

  private contractAddress = '0x22C1f6050E56d2876009903609a2cC3fEf83B415';

  private contractABI = [{"constant":true,"inputs":[{"name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}];

  constructor(private http: HttpClient) { }

  public getPoapsOwned(owner: string, network: string): Observable<any> {
    let apiUrl = '';

    owner = owner.toLocaleLowerCase();

    switch(network.toLocaleLowerCase()) {
      case 'mainnet':
        apiUrl = 'https://api.thegraph.com/subgraphs/name/poap-xyz/poap';
        break;
      case 'xdai':
        apiUrl = 'https://api.thegraph.com/subgraphs/name/poap-xyz/poap-xdai';
        break;
      default:
        throw new Error('Invalid Network');
    }

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const graphqlQuery = {
      query: `{
        accounts(where: {id: "${owner}"}) {
          id
          tokens {
            id,
            created,
            mintOrder,
            transferCount,
            transfers {
              id,
              from {
                  id
              },
              to {
                  id
              },
              timestamp,
              transaction
            },
            event {
              id,
              created,
              tokenCount,
              tokenMints,
              transferCount
            }
          }
          tokensOwned
        }
      }`
    };

    return this.http.post(apiUrl, JSON.stringify(graphqlQuery), { headers });
  }

  public async getTokenUri(tokenId: number): Promise<string> {
    const contract = new ethers.Contract(this.contractAddress, this.contractABI, this.xDAIProvider);
    try {
      const uri = await contract['tokenURI'](tokenId);
      return uri;
    } catch (error) {
      console.error('Error fetching token URI:', error);
      throw error;
    }
  }
}
