const graphql = require("graphql");
const _ = require("lodash");
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean } = graphql;

const User = require("../../models/user");
const Product = require("../../models/product");


const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
    })
});

const ProductType = new GraphQLObjectType({
    name: "Product",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        done: { type: GraphQLBoolean }
    })
})


const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return User.findById(args.id)
            }

        },
        users: {
            type: GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({});
            }
        },
        products: {
            type: GraphQLList(ProductType),
            resolve(parent, args) {
                return Product.find({});
            }
        },
        product: {
            type: ProductType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Product.findById(args.id);
            }
        }
    }
})


const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addUser: {
            type: UserType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                username: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                const user = new User({
                    name: args.name,
                    age: args.age,
                    username: args.username
                });
                return user.save();
            }
        },
        addProduct: {
            type: ProductType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                done: { type: GraphQLBoolean }
            },
            resolve(parent, args) {
                const product = new Product({
                    name: args.name,
                    done: args.done
                });
                return product.save();
            }
        },
        removeProduct: {
            type: ProductType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                // return Product.findById(args.id);
                return Product.deleteOne(Product.findById(args.id));
            }
        },
        deleteProducts: {
            type: GraphQLList(ProductType),
            args: {
                ids: { type: GraphQLList(GraphQLID) }
            },
            resolve(parent, args) {
                args.ids.forEach(id => {
                    Product.remove(({ _id: id }))
                });
            }
        },
        updateProduct: {
            type: ProductType,
            args: {
                id: { type: GraphQLID },
                done: { type: GraphQLBoolean }
            },
            resolve(parent, args) {
                // let changedProduct = Product.findById(args.id);
                // Product.findOneAndUpdate
                // console.log(changedProduct);
                // return changedProduct;
                const filter = { _id: args.id }
                const update = { done: args.done }
                return Product.findOneAndUpdate(filter, update);

            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})