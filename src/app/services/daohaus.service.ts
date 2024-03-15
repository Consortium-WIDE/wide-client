import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

@Injectable({
  providedIn: 'root'
})
export class DaohausService {

  constructor(private apollo: Apollo, private httpLink: HttpLink) {
    this.initializeApollo();
  }

  private initializeApollo(): void {
    // const uri = 'https://gateway.thegraph.com/api/af5f80e593efcb2a04cdf7f9c2e42553/subgraphs/id/5oXHJGgAWTSEXHK5FGf7mcxYtk6rSz7MJV5ccvGfoW6q'; // Your GraphQL endpoint
    // const http = this.httpLink.create({ uri });

    // this.apollo.create({
    //   link: http,
    //   cache: new InMemoryCache(),
    // });
  }

  getData(userAddress: string) {
    const GET_DATA_QUERY = gql`
    {
      daos(where: { members_: { memberAddress: "${userAddress}" } } ) {
        id
        name
        createdAt
        createdBy
        activeMemberCount
        safeAddress
        sharesAddress
        shareTokenName
        shareTokenSymbol
        txHash
        members(where: { memberAddress: "${userAddress}"}) {
          id
          createdAt
          memberAddress
          shares
          loot
        }
      }
    }
    `;

    return this.apollo.watchQuery<any>({
      query: GET_DATA_QUERY,
    }).valueChanges;
  }

}
