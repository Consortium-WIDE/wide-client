    {
      daos(where: { members_: { memberAddress: "${t}" } } ) {
        id
        name
        createdAt
        createdBy
        activeMemberCount
        safeAddress
        sharesAddress
        shareTokenName
        shareTokenSymbol
        totalShares
        txHash
        members(where: { memberAddress: "${t}"}) {
          id
          createdAt
          memberAddress
          shares
          loot
        }
      }
    }