from scipy.special import comb

def marginalGoalSuitP(cards):
    '''
    Assuming 4 players, 40 cards total split in 12/10/10/8

    @cards: a 4-tuple of cards in hand at start of game; first two (and the last two) are the same suit
    @return: 4-tuple denoting the probability of each suit being the goal
    '''

    a, b, c, d = cards

    # if a is goal, then b is common and has 12 cards
    # this is unscaled likelihood (scaling: 40C10 * 1/3)
    def likelihood(common, others):
        a, b, c = others
        return comb(12, common) * (comb(8, a) * comb(10, b) * comb(10, c)
                                    + comb(10, a) * comb(8, b) * comb(10, c)
                                    + comb(10, a) * comb(10, b) * comb(8, c))

    likelihoods = (likelihood(b, (a, c, d)),  # common suit is switched
                   likelihood(a, (b, c, d)),
                   likelihood(d, (a, b, c)),
                   likelihood(c, (a, b, d)))

    s = sum(likelihoods)
    likelihoods = tuple([x/s for x in likelihoods])
    return likelihoods


print(marginalGoalSuitP((3, 2, 2, 3)))

print(marginalGoalSuitP((5, 5, 0, 0)))
print(marginalGoalSuitP((2, 3, 2, 3)))
print(marginalGoalSuitP((3, 4, 0, 3)))