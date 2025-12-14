"""
Main GraphQL schema.
"""
import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError

# Import all query and mutation classes
from organizations.schema import (
    OrganizationQuery,
    OrganizationMutation,
)
from projects.schema import (
    ProjectQuery,
    ProjectMutation,
)
from tasks.schema import (
    TaskQuery,
    TaskMutation,
)

class Query(
    OrganizationQuery,
    ProjectQuery,
    TaskQuery,
    graphene.ObjectType
):
    pass

class Mutation(
    OrganizationMutation,
    ProjectMutation,
    TaskMutation,
    graphene.ObjectType
):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)

