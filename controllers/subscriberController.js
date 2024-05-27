exports.getSubscriptionPage = (req, res) => {
    res.render("contact");
};
exports.saveSubscriber = async (req, res) => {
    try {
        await Subscriber.create({
            name: req.body.name,
            email: req.body.email,
            zipCode: req.body.zipCode
        });
        res.render("thanks");
    } catch (err) {
        res.status(500).send({
            message: err.message
        });
    }
};


exports.getAllSubscribers = async (req, res) => {
    try {
        data = await Subscriber.findAll();
        console.log(data);
        res.render("subscriber", {subscribers: data});
    } catch (err) {
        res.status(500).send({
        message: err.message
        });
    }
};