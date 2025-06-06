const healthCheck = async (req,res) => {
    try {
        return res.status(200).json({message:"health is good"})
    } catch (error) {
        return res.status(500).json({message:error})
    }
}

export {healthCheck}